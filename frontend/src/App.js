import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import { Card } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Progress } from "./components/ui/progress";
import { 
  BarChart3, 
  Users, 
  Target, 
  TrendingUp, 
  Brain, 
  Network, 
  AlertTriangle,
  Award,
  BookOpen,
  Activity,
  Calendar,
  Settings
} from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Dashboard Overview Component
const DashboardOverview = ({ data }) => {
  if (!data) return <div className="text-center p-8">Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Employees</p>
              <p className="text-3xl font-bold text-blue-900">{data.metrics.total_employees}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Active Projects</p>
              <p className="text-3xl font-bold text-green-900">{data.metrics.active_projects}</p>
            </div>
            <Target className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Avg Performance</p>
              <p className="text-3xl font-bold text-purple-900">{(data.metrics.avg_performance_score * 100).toFixed(0)}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-500" />
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Productivity Score</p>
              <p className="text-3xl font-bold text-orange-900">{(data.metrics.avg_productivity_score * 100).toFixed(0)}%</p>
            </div>
            <Activity className="h-8 w-8 text-orange-500" />
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-teal-600">Project Success Rate</p>
              <p className="text-3xl font-bold text-teal-900">{data.metrics.avg_project_success_rate}%</p>
            </div>
            <Award className="h-8 w-8 text-teal-500" />
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-indigo-600">Total Projects</p>
              <p className="text-3xl font-bold text-indigo-900">{data.metrics.total_projects}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-indigo-500" />
          </div>
        </Card>
      </div>

      {/* Department Distribution */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Users className="w-5 h-5 mr-2" />
          Department Distribution
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(data.department_distribution).map(([dept, count]) => (
            <div key={dept} className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-800">{count}</p>
              <p className="text-sm text-gray-600">{dept}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

// Collaboration Network Component
const CollaborationNetwork = ({ data }) => {
  if (!data) return <div className="text-center p-8">Loading collaboration network...</div>;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Network className="w-5 h-5 mr-2" />
          Collaboration Network Analysis
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Network Stats */}
          <div className="space-y-4">
            <h4 className="font-medium">Network Statistics</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Connections:</span>
                <Badge variant="secondary">{data.edges.length}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Active Collaborators:</span>
                <Badge variant="secondary">{data.nodes.length}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Avg Connection Strength:</span>
                <Badge variant="secondary">
                  {(data.edges.reduce((sum, edge) => sum + edge.strength, 0) / data.edges.length).toFixed(2)}
                </Badge>
              </div>
            </div>
          </div>
          
          {/* Top Collaborators */}
          <div className="space-y-4">
            <h4 className="font-medium">Top Collaborators</h4>
            <div className="space-y-2">
              {data.nodes
                .sort((a, b) => b.collaboration_index - a.collaboration_index)
                .slice(0, 5)
                .map((node, index) => (
                  <div key={node.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium text-sm">{node.name}</p>
                      <p className="text-xs text-gray-600">{node.department}</p>
                    </div>
                    <Badge variant="outline">{(node.collaboration_index * 100).toFixed(0)}%</Badge>
                  </div>
                ))}
            </div>
          </div>
        </div>
        
        {/* Department Collaboration */}
        <div className="mt-6">
          <h4 className="font-medium mb-3">Department Collaboration Patterns</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Array.from(new Set(data.nodes.map(n => n.department))).map(dept => {
              const deptNodes = data.nodes.filter(n => n.department === dept);
              const avgCollaboration = deptNodes.reduce((sum, node) => sum + node.collaboration_index, 0) / deptNodes.length;
              
              return (
                <div key={dept} className="p-3 bg-blue-50 rounded-lg text-center">
                  <p className="text-sm font-medium">{dept}</p>
                  <p className="text-lg font-bold text-blue-600">{(avgCollaboration * 100).toFixed(0)}%</p>
                  <p className="text-xs text-gray-600">{deptNodes.length} members</p>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
};

// Skill Gap Analysis Component
const SkillGapAnalysis = ({ data }) => {
  if (!data) return <div className="text-center p-8">Loading skill analysis...</div>;

  return (
    <div className="space-y-6">
      {/* Critical Gaps Alert */}
      {data.critical_gaps.length > 0 && (
        <Card className="p-6 border-red-200 bg-red-50">
          <h3 className="text-lg font-semibold mb-4 flex items-center text-red-800">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Critical Skill Gaps ({data.critical_gaps.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.critical_gaps.slice(0, 4).map((gap, index) => (
              <div key={index} className="p-4 bg-white rounded-lg border border-red-200">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">{gap.skill}</p>
                    <p className="text-sm text-gray-600">{gap.department}</p>
                  </div>
                  <Badge variant="destructive">{gap.gap_percentage}% gap</Badge>
                </div>
                <p className="text-sm text-gray-700">{gap.affected_employees} employees affected</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Department Skill Analysis */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <BookOpen className="w-5 h-5 mr-2" />
          Skill Gap Analysis by Department
        </h3>
        
        <div className="space-y-6">
          {Object.entries(data.by_department).map(([dept, gaps]) => (
            <div key={dept} className="border rounded-lg p-4">
              <h4 className="font-medium mb-3">{dept} Department</h4>
              <div className="space-y-3">
                {gaps.map((gap, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm">{gap.skill}</span>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={gap.gap_level === 'critical' ? 'destructive' : 
                                 gap.gap_level === 'moderate' ? 'default' : 'secondary'}
                        >
                          {gap.gap_level}
                        </Badge>
                        <span className="text-sm text-gray-600">{gap.gap_percentage}% gap</span>
                      </div>
                    </div>
                    <Progress value={gap.current_proficiency * 100} className="h-2" />
                    <div className="text-xs text-gray-600">
                      Current: {(gap.current_proficiency * 100).toFixed(0)}% | 
                      Required: {(gap.required_proficiency * 100).toFixed(0)}% | 
                      Affected: {gap.affected_employees} employees
                    </div>
                    
                    {/* Training Recommendations */}
                    <div className="mt-2">
                      <p className="text-xs font-medium text-gray-700 mb-1">Recommended Training:</p>
                      <div className="flex flex-wrap gap-1">
                        {gap.training_recommendations.map((rec, recIndex) => (
                          <Badge key={recIndex} variant="outline" className="text-xs">
                            {rec}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Summary Stats */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Skill Gap Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{data.summary.total_gaps}</p>
            <p className="text-sm text-gray-600">Total Skill Gaps</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-2xl font-bold text-red-600">{data.summary.critical_gaps_count}</p>
            <p className="text-sm text-gray-600">Critical Gaps</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{data.summary.departments_affected}</p>
            <p className="text-sm text-gray-600">Departments Affected</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

// Project Forecasting Component
const ProjectForecasting = ({ data }) => {
  if (!data) return <div className="text-center p-8">Loading forecasting data...</div>;

  return (
    <div className="space-y-6">
      {/* Success Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Project Success Distribution
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="font-medium">High Success (≥80%)</span>
              <Badge className="bg-green-600">{data.success_distribution.high} projects</Badge>
            </div>
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
              <span className="font-medium">Medium Success (60-79%)</span>
              <Badge className="bg-yellow-600">{data.success_distribution.medium} projects</Badge>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span className="font-medium">Low Success (&lt;60%)</span>
              <Badge className="bg-red-600">{data.success_distribution.low} projects</Badge>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Project Status Overview
          </h3>
          <div className="space-y-3">
            {Object.entries(data.status_distribution).map(([status, count]) => (
              <div key={status} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="font-medium">{status}</span>
                <Badge variant="secondary">{count}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Department Success Rates */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2" />
          Success Rates by Department
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(data.department_success_rates).map(([dept, rate]) => (
            <div key={dept} className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <p className="font-medium">{dept}</p>
              <p className="text-2xl font-bold text-blue-600">{rate}%</p>
              <Progress value={rate} className="mt-2 h-2" />
            </div>
          ))}
        </div>
      </Card>

      {/* Risk Projects */}
      {data.risk_projects.length > 0 && (
        <Card className="p-6 border-orange-200 bg-orange-50">
          <h3 className="text-lg font-semibold mb-4 flex items-center text-orange-800">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Projects at Risk ({data.risk_projects.length})
          </h3>
          <div className="space-y-3">
            {data.risk_projects.map((project, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-white rounded-lg border border-orange-200">
                <div>
                  <p className="font-medium">{project.name}</p>
                  <p className="text-sm text-gray-600">
                    Status: {project.status} | Team Size: {project.team_size}
                  </p>
                </div>
                <Badge variant="destructive">
                  {(project.success_probability * 100).toFixed(0)}% success
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Insights */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Brain className="w-5 h-5 mr-2" />
          Forecasting Insights
        </h3>
        <div className="space-y-2">
          {data.forecasting_insights.map((insight, index) => (
            <div key={index} className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm text-gray-700">{insight}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

// Performance Trends Component
const PerformanceTrends = ({ data }) => {
  if (!data) return <div className="text-center p-8">Loading performance data...</div>;

  return (
    <div className="space-y-6">
      {/* Department Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Performance by Department
          </h3>
          <div className="space-y-3">
            {Object.entries(data.department_performance)
              .sort(([,a], [,b]) => b - a)
              .map(([dept, score]) => (
                <div key={dept} className="space-y-1">
                  <div className="flex justify-between">
                    <span className="font-medium">{dept}</span>
                    <span className="text-sm font-bold">{(score * 100).toFixed(0)}%</span>
                  </div>
                  <Progress value={score * 100} className="h-2" />
                </div>
              ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Productivity by Department
          </h3>
          <div className="space-y-3">
            {Object.entries(data.department_productivity)
              .sort(([,a], [,b]) => b - a)
              .map(([dept, score]) => (
                <div key={dept} className="space-y-1">
                  <div className="flex justify-between">
                    <span className="font-medium">{dept}</span>
                    <span className="text-sm font-bold">{(score * 100).toFixed(0)}%</span>
                  </div>
                  <Progress value={score * 100} className="h-2" />
                </div>
              ))}
          </div>
        </Card>
      </div>

      {/* Top Performers */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Award className="w-5 h-5 mr-2" />
          Top Performers
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.top_performers.slice(0, 9).map((performer, index) => (
            <div key={index} className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium">{performer.name}</p>
                <Badge className="bg-yellow-600">#{index + 1}</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-2">{performer.department}</p>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Performance:</span>
                  <span className="font-bold">{(performer.performance_score * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Productivity:</span>
                  <span className="font-bold">{(performer.productivity_score * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Experience Correlation */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Experience vs Performance Analysis
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { range: "1-3 years", min: 1, max: 3 },
            { range: "4-7 years", min: 4, max: 7 },
            { range: "8-12 years", min: 8, max: 12 },
            { range: "13+ years", min: 13, max: 20 }
          ].map(({ range, min, max }) => {
            const groupData = data.experience_correlation.filter(
              emp => emp.experience >= min && emp.experience <= max
            );
            const avgPerformance = groupData.length > 0 
              ? groupData.reduce((sum, emp) => sum + emp.performance, 0) / groupData.length
              : 0;
            
            return (
              <div key={range} className="p-4 bg-purple-50 rounded-lg text-center">
                <p className="font-medium text-purple-800">{range}</p>
                <p className="text-2xl font-bold text-purple-600">{(avgPerformance * 100).toFixed(0)}%</p>
                <p className="text-xs text-gray-600">{groupData.length} employees</p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Insights */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Brain className="w-5 h-5 mr-2" />
          Performance Insights
        </h3>
        <div className="space-y-2">
          {data.insights.map((insight, index) => (
            <div key={index} className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm text-gray-700">{insight}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

// Semantic Matching Component
const SemanticMatching = ({ data }) => {
  if (!data) return <div className="text-center p-8">Loading semantic analysis...</div>;

  return (
    <div className="space-y-6">
      {/* Project Skill Matching */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2" />
          Project-Employee Skill Matching
        </h3>
        <div className="space-y-4">
          {data.project_skill_matching.slice(0, 3).map((project, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-medium">{project.project}</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {project.required_skills.map((skill, skillIndex) => (
                      <Badge key={skillIndex} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Badge variant="secondary">
                  Current team: {project.current_team.length}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Recommended Employees:</p>
                {project.recommended_employees.slice(0, 3).map((emp, empIndex) => (
                  <div key={empIndex} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium text-sm">{emp.name}</p>
                      <p className="text-xs text-gray-600">{emp.department}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {emp.matching_skills.map((skill, skillIndex) => (
                          <Badge key={skillIndex} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-green-600 mb-1">
                        {emp.match_percentage}% match
                      </Badge>
                      <p className="text-xs text-gray-600">
                        Performance: {(emp.performance_score * 100).toFixed(0)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Skill Clusters */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Network className="w-5 h-5 mr-2" />
          Skill-Based Employee Clusters
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.skill_clusters
            .sort((a, b) => b.cluster_size - a.cluster_size)
            .slice(0, 6)
            .map((cluster, index) => (
              <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-blue-800">
                    Cluster {index + 1}
                  </h4>
                  <Badge className="bg-blue-600">
                    {cluster.cluster_size} members
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-1">Common Skills:</p>
                    <div className="flex flex-wrap gap-1">
                      {cluster.skills.map((skill, skillIndex) => (
                        <Badge key={skillIndex} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-1">Team Members:</p>
                    <div className="text-xs text-gray-600">
                      {cluster.employees.join(", ")}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </Card>

      {/* Recommendations */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Brain className="w-5 h-5 mr-2" />
          Semantic Matching Recommendations
        </h3>
        <div className="space-y-2">
          {data.recommendations.map((recommendation, index) => (
            <div key={index} className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm text-gray-700">{recommendation}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

// Main App Component
function App() {
  const [dashboardData, setDashboardData] = useState(null);
  const [collaborationData, setCollaborationData] = useState(null);
  const [skillGapData, setSkillGapData] = useState(null);
  const [forecastingData, setForecastingData] = useState(null);
  const [performanceData, setPerformanceData] = useState(null);
  const [semanticData, setSemanticData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataInitialized, setDataInitialized] = useState(false);

  const initializeData = async () => {
    setLoading(true);
    try {
      await axios.post(`${API}/initialize-data`);
      setDataInitialized(true);
      
      // Load all analytics data
      const [dashboard, collaboration, skillGap, forecasting, performance, semantic] = await Promise.all([
        axios.get(`${API}/dashboard/overview`),
        axios.get(`${API}/analytics/collaboration-network`),
        axios.get(`${API}/analytics/skill-gaps`),
        axios.get(`${API}/analytics/project-forecasting`),
        axios.get(`${API}/analytics/performance-trends`),
        axios.get(`${API}/analytics/semantic-matching`)
      ]);

      setDashboardData(dashboard.data);
      setCollaborationData(collaboration.data);
      setSkillGapData(skillGap.data);
      setForecastingData(forecasting.data);
      setPerformanceData(performance.data);
      setSemanticData(semantic.data);
    } catch (error) {
      console.error("Error initializing data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Auto-initialize data on component mount
    initializeData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Brain className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Workforce Productivity Analytics
                </h1>
                <p className="text-sm text-gray-500">
                  BigQuery AI-Powered Insights Platform
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {!dataInitialized && (
                <Button 
                  onClick={initializeData} 
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? "Initializing..." : "Initialize Sample Data"}
                </Button>
              )}
              <Badge variant="outline" className="flex items-center space-x-1">
                <Settings className="w-3 h-3" />
                <span>BigQuery Connected</span>
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!dataInitialized ? (
          <div className="text-center py-16">
            <Brain className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to Workforce Analytics
            </h2>
            <p className="text-gray-600 mb-6">
              Initialize sample data to start exploring AI-powered workforce insights
            </p>
            <Button 
              onClick={initializeData} 
              disabled={loading}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? "Setting up analytics..." : "Get Started"}
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
              <TabsTrigger value="overview" className="flex items-center space-x-1">
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="collaboration" className="flex items-center space-x-1">
                <Network className="w-4 h-4" />
                <span className="hidden sm:inline">Network</span>
              </TabsTrigger>
              <TabsTrigger value="skills" className="flex items-center space-x-1">
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Skills</span>
              </TabsTrigger>
              <TabsTrigger value="forecasting" className="flex items-center space-x-1">
                <Target className="w-4 h-4" />
                <span className="hidden sm:inline">Projects</span>
              </TabsTrigger>
              <TabsTrigger value="performance" className="flex items-center space-x-1">
                <TrendingUp className="w-4 h-4" />
                <span className="hidden sm:inline">Performance</span>
              </TabsTrigger>
              <TabsTrigger value="semantic" className="flex items-center space-x-1">
                <Brain className="w-4 h-4" />
                <span className="hidden sm:inline">AI Matching</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <DashboardOverview data={dashboardData} />
            </TabsContent>

            <TabsContent value="collaboration">
              <CollaborationNetwork data={collaborationData} />
            </TabsContent>

            <TabsContent value="skills">
              <SkillGapAnalysis data={skillGapData} />
            </TabsContent>

            <TabsContent value="forecasting">
              <ProjectForecasting data={forecastingData} />
            </TabsContent>

            <TabsContent value="performance">
              <PerformanceTrends data={performanceData} />
            </TabsContent>

            <TabsContent value="semantic">
              <SemanticMatching data={semanticData} />
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
}

export default App;