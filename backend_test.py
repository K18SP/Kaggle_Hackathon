import requests
import sys
import json
from datetime import datetime

class WorkforceAnalyticsAPITester:
    def __init__(self, base_url="https://teamiq-analytics.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test results"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED")
        else:
            print(f"❌ {name} - FAILED: {details}")
        
        self.test_results.append({
            "test": name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        })

    def test_api_endpoint(self, method, endpoint, expected_status=200, data=None, test_name=None):
        """Generic API endpoint tester"""
        url = f"{self.api_url}/{endpoint}"
        test_name = test_name or f"{method} {endpoint}"
        
        try:
            if method == 'GET':
                response = requests.get(url, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, timeout=30)
            else:
                self.log_test(test_name, False, f"Unsupported method: {method}")
                return False, {}

            success = response.status_code == expected_status
            
            if success:
                try:
                    response_data = response.json()
                    self.log_test(test_name, True, f"Status: {response.status_code}")
                    return True, response_data
                except json.JSONDecodeError:
                    self.log_test(test_name, False, f"Invalid JSON response, Status: {response.status_code}")
                    return False, {}
            else:
                self.log_test(test_name, False, f"Expected {expected_status}, got {response.status_code}")
                return False, {}

        except requests.exceptions.Timeout:
            self.log_test(test_name, False, "Request timeout (30s)")
            return False, {}
        except requests.exceptions.ConnectionError:
            self.log_test(test_name, False, "Connection error")
            return False, {}
        except Exception as e:
            self.log_test(test_name, False, f"Exception: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test the root API endpoint"""
        return self.test_api_endpoint('GET', '', 200, test_name="Root API Endpoint")

    def test_initialize_data(self):
        """Test data initialization"""
        print("\n🔄 Testing Data Initialization...")
        success, response = self.test_api_endpoint('POST', 'initialize-data', 200, test_name="Initialize Sample Data")
        
        if success:
            # Validate response structure
            required_keys = ['message', 'counts']
            if all(key in response for key in required_keys):
                counts = response['counts']
                expected_counts = ['employees', 'projects', 'collaborations', 'skill_gaps']
                
                if all(key in counts for key in expected_counts):
                    print(f"   📊 Data counts: {counts}")
                    self.log_test("Data Structure Validation", True, "All required data generated")
                    return True
                else:
                    self.log_test("Data Structure Validation", False, "Missing count keys")
            else:
                self.log_test("Data Structure Validation", False, "Missing response keys")
        
        return success

    def test_dashboard_overview(self):
        """Test dashboard overview endpoint"""
        print("\n📊 Testing Dashboard Overview...")
        success, response = self.test_api_endpoint('GET', 'dashboard/overview', 200, test_name="Dashboard Overview")
        
        if success:
            # Validate response structure
            required_keys = ['metrics', 'department_distribution', 'timestamp']
            if all(key in response for key in required_keys):
                metrics = response['metrics']
                required_metrics = ['total_employees', 'total_projects', 'active_projects', 
                                  'avg_performance_score', 'avg_productivity_score', 'avg_project_success_rate']
                
                if all(key in metrics for key in required_metrics):
                    print(f"   👥 Total Employees: {metrics['total_employees']}")
                    print(f"   📈 Active Projects: {metrics['active_projects']}")
                    print(f"   🎯 Avg Performance: {metrics['avg_performance_score']}")
                    self.log_test("Dashboard Metrics Validation", True, "All metrics present")
                    return True
                else:
                    self.log_test("Dashboard Metrics Validation", False, "Missing metric keys")
            else:
                self.log_test("Dashboard Structure Validation", False, "Missing response keys")
        
        return success

    def test_collaboration_network(self):
        """Test collaboration network endpoint"""
        print("\n🌐 Testing Collaboration Network...")
        success, response = self.test_api_endpoint('GET', 'analytics/collaboration-network', 200, test_name="Collaboration Network")
        
        if success:
            # Validate response structure
            required_keys = ['nodes', 'edges']
            if all(key in response for key in required_keys):
                nodes_count = len(response['nodes'])
                edges_count = len(response['edges'])
                print(f"   👥 Network Nodes: {nodes_count}")
                print(f"   🔗 Network Edges: {edges_count}")
                
                # Validate node structure
                if nodes_count > 0:
                    node = response['nodes'][0]
                    required_node_keys = ['id', 'name', 'department', 'role', 'performance_score', 'collaboration_index']
                    if all(key in node for key in required_node_keys):
                        self.log_test("Network Structure Validation", True, f"Valid network with {nodes_count} nodes, {edges_count} edges")
                        return True
                    else:
                        self.log_test("Network Structure Validation", False, "Invalid node structure")
                else:
                    self.log_test("Network Structure Validation", False, "No nodes in network")
            else:
                self.log_test("Network Response Validation", False, "Missing nodes/edges keys")
        
        return success

    def test_skill_gaps(self):
        """Test skill gap analysis endpoint"""
        print("\n🎯 Testing Skill Gap Analysis...")
        success, response = self.test_api_endpoint('GET', 'analytics/skill-gaps', 200, test_name="Skill Gap Analysis")
        
        if success:
            # Validate response structure
            required_keys = ['by_department', 'critical_gaps', 'summary']
            if all(key in response for key in required_keys):
                critical_gaps_count = len(response['critical_gaps'])
                departments_count = len(response['by_department'])
                print(f"   🚨 Critical Gaps: {critical_gaps_count}")
                print(f"   🏢 Departments Analyzed: {departments_count}")
                
                # Validate summary
                summary = response['summary']
                required_summary_keys = ['total_gaps', 'critical_gaps_count', 'departments_affected']
                if all(key in summary for key in required_summary_keys):
                    print(f"   📊 Total Gaps: {summary['total_gaps']}")
                    self.log_test("Skill Gap Structure Validation", True, f"Analysis complete for {departments_count} departments")
                    return True
                else:
                    self.log_test("Skill Gap Structure Validation", False, "Invalid summary structure")
            else:
                self.log_test("Skill Gap Response Validation", False, "Missing response keys")
        
        return success

    def test_project_forecasting(self):
        """Test project forecasting endpoint"""
        print("\n🔮 Testing Project Forecasting...")
        success, response = self.test_api_endpoint('GET', 'analytics/project-forecasting', 200, test_name="Project Forecasting")
        
        if success:
            # Validate response structure
            required_keys = ['success_distribution', 'status_distribution', 'department_success_rates', 'risk_projects', 'forecasting_insights']
            if all(key in response for key in required_keys):
                success_dist = response['success_distribution']
                risk_projects_count = len(response['risk_projects'])
                insights_count = len(response['forecasting_insights'])
                
                print(f"   📈 High Success Projects: {success_dist.get('high', 0)}")
                print(f"   ⚠️ Risk Projects: {risk_projects_count}")
                print(f"   💡 Insights Generated: {insights_count}")
                
                self.log_test("Forecasting Structure Validation", True, f"Forecasting complete with {insights_count} insights")
                return True
            else:
                self.log_test("Forecasting Response Validation", False, "Missing response keys")
        
        return success

    def test_performance_trends(self):
        """Test performance trends endpoint"""
        print("\n📈 Testing Performance Trends...")
        success, response = self.test_api_endpoint('GET', 'analytics/performance-trends', 200, test_name="Performance Trends")
        
        if success:
            # Validate response structure
            required_keys = ['department_performance', 'department_productivity', 'top_performers', 'experience_correlation', 'insights']
            if all(key in response for key in required_keys):
                top_performers_count = len(response['top_performers'])
                departments_count = len(response['department_performance'])
                insights_count = len(response['insights'])
                
                print(f"   🏆 Top Performers: {top_performers_count}")
                print(f"   🏢 Departments Analyzed: {departments_count}")
                print(f"   💡 Performance Insights: {insights_count}")
                
                self.log_test("Performance Structure Validation", True, f"Analysis complete for {departments_count} departments")
                return True
            else:
                self.log_test("Performance Response Validation", False, "Missing response keys")
        
        return success

    def test_semantic_matching(self):
        """Test semantic skill matching endpoint"""
        print("\n🧠 Testing Semantic Skill Matching...")
        success, response = self.test_api_endpoint('GET', 'analytics/semantic-matching', 200, test_name="Semantic Matching")
        
        if success:
            # Validate response structure
            required_keys = ['project_skill_matching', 'skill_clusters', 'recommendations']
            if all(key in response for key in required_keys):
                project_matches_count = len(response['project_skill_matching'])
                skill_clusters_count = len(response['skill_clusters'])
                recommendations_count = len(response['recommendations'])
                
                print(f"   🎯 Project Matches: {project_matches_count}")
                print(f"   🔗 Skill Clusters: {skill_clusters_count}")
                print(f"   💡 AI Recommendations: {recommendations_count}")
                
                self.log_test("Semantic Matching Structure Validation", True, f"AI analysis complete with {recommendations_count} recommendations")
                return True
            else:
                self.log_test("Semantic Matching Response Validation", False, "Missing response keys")
        
        return success

    def run_comprehensive_test_suite(self):
        """Run all tests in sequence"""
        print("🚀 Starting Comprehensive Workforce Analytics API Testing")
        print("=" * 60)
        
        # Test sequence
        test_sequence = [
            ("Root API", self.test_root_endpoint),
            ("Data Initialization", self.test_initialize_data),
            ("Dashboard Overview", self.test_dashboard_overview),
            ("Collaboration Network", self.test_collaboration_network),
            ("Skill Gap Analysis", self.test_skill_gaps),
            ("Project Forecasting", self.test_project_forecasting),
            ("Performance Trends", self.test_performance_trends),
            ("Semantic Matching", self.test_semantic_matching)
        ]
        
        for test_name, test_func in test_sequence:
            try:
                test_func()
            except Exception as e:
                self.log_test(f"{test_name} - Exception", False, str(e))
        
        # Print final results
        print("\n" + "=" * 60)
        print("📊 FINAL TEST RESULTS")
        print("=" * 60)
        print(f"✅ Tests Passed: {self.tests_passed}")
        print(f"❌ Tests Failed: {self.tests_run - self.tests_passed}")
        print(f"📈 Success Rate: {(self.tests_passed / self.tests_run * 100):.1f}%")
        
        # Show failed tests
        failed_tests = [result for result in self.test_results if not result['success']]
        if failed_tests:
            print("\n🚨 FAILED TESTS:")
            for test in failed_tests:
                print(f"   ❌ {test['test']}: {test['details']}")
        
        return self.tests_passed == self.tests_run

def main():
    """Main test execution"""
    tester = WorkforceAnalyticsAPITester()
    
    try:
        success = tester.run_comprehensive_test_suite()
        return 0 if success else 1
    except KeyboardInterrupt:
        print("\n⚠️ Testing interrupted by user")
        return 1
    except Exception as e:
        print(f"\n💥 Unexpected error: {str(e)}")
        return 1

if __name__ == "__main__":
    sys.exit(main())