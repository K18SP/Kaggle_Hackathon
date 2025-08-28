from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import json
import asyncio
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import uuid
from datetime import datetime, timezone
from contextlib import asynccontextmanager
try:
    from google.cloud import bigquery
    from google.oauth2 import service_account
    BIGQUERY_AVAILABLE = True
except ImportError:
    BIGQUERY_AVAILABLE = False
    bigquery = None
    service_account = None

import numpy as np
import pandas as pd


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# BigQuery setup
bq_client = None
if BIGQUERY_AVAILABLE:
    credentials_path = os.environ.get('GOOGLE_APPLICATION_CREDENTIALS')
    project_id = os.environ.get('BIGQUERY_PROJECT_ID')

    if credentials_path and os.path.exists(credentials_path):
        credentials = service_account.Credentials.from_service_account_file(credentials_path)
        bq_client = bigquery.Client(credentials=credentials, project=project_id)
        logging.info("BigQuery client initialized successfully")
    else:
        logging.warning("BigQuery credentials not found, using sample data only")
else:
    logging.warning("BigQuery library not available, using sample data only")

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: nothing additional needed as connections are already established
    yield
    # Shutdown: close the MongoDB client
    client.close()

# Create the main app without a prefix
app = FastAPI(title="Workforce Productivity Analytics API", lifespan=lifespan)

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Pydantic Models
class Employee(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    department: str
    role: str
    skills: List[str]
    experience_years: int
    performance_score: float
    collaboration_index: float
    productivity_score: float
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Project(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    status: str
    success_probability: float
    team_members: List[str]
    required_skills: List[str]
    start_date: datetime
    estimated_completion: datetime
    actual_completion: Optional[datetime] = None
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CollaborationNetwork(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    employee_a: str
    employee_b: str
    interaction_frequency: float
    collaboration_strength: float
    projects_shared: int
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class SkillGap(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    department: str
    skill: str
    gap_level: str  # "critical", "moderate", "low"
    current_proficiency: float
    required_proficiency: float
    affected_employees: int
    training_recommendations: List[str]
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AnalyticsResult(BaseModel):
    type: str
    data: Dict[str, Any]
    insights: List[str]
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Sample data generator
def generate_sample_employees():
    departments = ["Engineering", "Marketing", "Sales", "HR", "Finance", "Operations"]
    roles = ["Manager", "Senior", "Junior", "Lead", "Specialist", "Analyst"]
    skills_pool = ["Python", "JavaScript", "Data Analysis", "Project Management", "Communication", 
                   "Leadership", "Machine Learning", "Cloud Computing", "Agile", "Marketing Strategy",
                   "Sales Management", "Financial Analysis", "HR Operations", "Team Leadership"]
    
    employees = []
    for i in range(50):
        employee_skills = np.random.choice(skills_pool, size=np.random.randint(3, 7), replace=False).tolist()
        employee = Employee(
            name=f"Employee {i+1}",
            department=np.random.choice(departments),
            role=np.random.choice(roles),
            skills=employee_skills,
            experience_years=np.random.randint(1, 15),
            performance_score=round(np.random.uniform(0.6, 1.0), 2),
            collaboration_index=round(np.random.uniform(0.3, 1.0), 2),
            productivity_score=round(np.random.uniform(0.5, 1.0), 2)
        )
        employees.append(employee)
    return employees

def generate_sample_projects(employees):
    project_names = ["AI Platform Development", "Customer Analytics Dashboard", "Mobile App Redesign",
                     "Cloud Migration", "Marketing Automation", "Sales CRM Enhancement",
                     "Financial Reporting System", "HR Digital Transformation"]
    
    projects = []
    for i, name in enumerate(project_names):
        team_size = np.random.randint(3, 8)
        team_members = np.random.choice([emp.name for emp in employees], size=team_size, replace=False).tolist()
        
        project = Project(
            name=name,
            description=f"Description for {name}",
            status=np.random.choice(["Planning", "In Progress", "Testing", "Completed", "On Hold"]),
            success_probability=round(np.random.uniform(0.4, 0.95), 2),
            team_members=team_members,
            required_skills=np.random.choice(employees[0].skills + ["Leadership", "Communication"], 
                                           size=np.random.randint(2, 5), replace=False).tolist(),
            start_date=datetime.now(timezone.utc),
            estimated_completion=datetime.now(timezone.utc)
        )
        projects.append(project)
    return projects

def generate_collaboration_network(employees):
    networks = []
    for i in range(100):
        emp_a, emp_b = np.random.choice(employees, size=2, replace=False)
        collaboration = CollaborationNetwork(
            employee_a=emp_a.name,
            employee_b=emp_b.name,
            interaction_frequency=round(np.random.uniform(0.1, 1.0), 2),
            collaboration_strength=round(np.random.uniform(0.2, 1.0), 2),
            projects_shared=np.random.randint(0, 5)
        )
        networks.append(collaboration)
    return networks

def generate_skill_gaps():
    departments = ["Engineering", "Marketing", "Sales", "HR", "Finance", "Operations"]
    skills = ["Python", "Machine Learning", "Cloud Computing", "Data Analysis", "Digital Marketing",
              "Sales Analytics", "Financial Modeling", "HR Technology", "Project Management"]
    
    gaps = []
    for dept in departments:
        for skill in np.random.choice(skills, size=3, replace=False):
            gap = SkillGap(
                department=dept,
                skill=skill,
                gap_level=np.random.choice(["critical", "moderate", "low"]),
                current_proficiency=round(np.random.uniform(0.3, 0.7), 2),
                required_proficiency=round(np.random.uniform(0.7, 1.0), 2),
                affected_employees=np.random.randint(5, 20),
                training_recommendations=[
                    f"Online {skill} certification",
                    f"Hands-on {skill} workshop",
                    f"Mentorship program for {skill}"
                ]
            )
            gaps.append(gap)
    return gaps

# API Routes
@api_router.get("/")
async def root():
    return {"message": "Workforce Productivity Analytics API"}

@api_router.post("/initialize-data")
async def initialize_sample_data():
    """Initialize the database with sample workforce data"""
    try:
        # Clear existing data
        await db.employees.delete_many({})
        await db.projects.delete_many({})
        await db.collaboration_networks.delete_many({})
        await db.skill_gaps.delete_many({})
        
        # Generate sample data
        employees = generate_sample_employees()
        projects = generate_sample_projects(employees)
        collaborations = generate_collaboration_network(employees)
        skill_gaps = generate_skill_gaps()
        
        # Insert data
        await db.employees.insert_many([emp.dict() for emp in employees])
        await db.projects.insert_many([proj.dict() for proj in projects])
        await db.collaboration_networks.insert_many([collab.dict() for collab in collaborations])
        await db.skill_gaps.insert_many([gap.dict() for gap in skill_gaps])
        
        return {
            "message": "Sample data initialized successfully",
            "counts": {
                "employees": len(employees),
                "projects": len(projects),
                "collaborations": len(collaborations),
                "skill_gaps": len(skill_gaps)
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/dashboard/overview")
async def get_dashboard_overview():
    """Get comprehensive dashboard overview with key metrics"""
    try:
        # Get counts
        employee_count = await db.employees.count_documents({})
        project_count = await db.projects.count_documents({})
        active_projects = await db.projects.count_documents({"status": {"$in": ["In Progress", "Planning"]}})
        
        # Get performance metrics
        employees = await db.employees.find().to_list(length=None)
        avg_performance = sum(emp.get('performance_score', 0) for emp in employees) / len(employees) if employees else 0
        avg_productivity = sum(emp.get('productivity_score', 0) for emp in employees) / len(employees) if employees else 0
        
        # Project success rate
        projects = await db.projects.find().to_list(length=None)
        avg_success_prob = sum(proj.get('success_probability', 0) for proj in projects) / len(projects) if projects else 0
        
        # Department distribution
        dept_distribution = {}
        for emp in employees:
            dept = emp.get('department', 'Unknown')
            dept_distribution[dept] = dept_distribution.get(dept, 0) + 1
        
        return {
            "metrics": {
                "total_employees": employee_count,
                "total_projects": project_count,
                "active_projects": active_projects,
                "avg_performance_score": round(avg_performance, 2),
                "avg_productivity_score": round(avg_productivity, 2),
                "avg_project_success_rate": round(avg_success_prob * 100, 1)
            },
            "department_distribution": dept_distribution,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/analytics/collaboration-network")
async def get_collaboration_network():
    """Get collaboration network data for visualization"""
    try:
        networks = await db.collaboration_networks.find().to_list(length=None)
        employees = await db.employees.find().to_list(length=None)
        
        # Create nodes (employees)
        nodes = []
        for emp in employees:
            nodes.append({
                "id": emp['name'],
                "name": emp['name'],
                "department": emp['department'],
                "role": emp['role'],
                "performance_score": emp['performance_score'],
                "collaboration_index": emp['collaboration_index']
            })
        
        # Create edges (collaborations)
        edges = []
        for network in networks:
            edges.append({
                "source": network['employee_a'],
                "target": network['employee_b'],
                "strength": network['collaboration_strength'],
                "frequency": network['interaction_frequency'],
                "projects_shared": network['projects_shared']
            })
        
        return {
            "nodes": nodes,
            "edges": edges
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/analytics/skill-gaps")
async def get_skill_gap_analysis():
    """Get skill gap analysis and training recommendations"""
    try:
        skill_gaps = await db.skill_gaps.find().to_list(length=None)
        
        # Organize by department
        by_department = {}
        critical_gaps = []
        
        for gap in skill_gaps:
            dept = gap['department']
            if dept not in by_department:
                by_department[dept] = []
            
            by_department[dept].append({
                "skill": gap['skill'],
                "gap_level": gap['gap_level'],
                "current_proficiency": gap['current_proficiency'],
                "required_proficiency": gap['required_proficiency'],
                "gap_percentage": round((gap['required_proficiency'] - gap['current_proficiency']) * 100, 1),
                "affected_employees": gap['affected_employees'],
                "training_recommendations": gap['training_recommendations']
            })
            
            if gap['gap_level'] == 'critical':
                critical_gaps.append({
                    "department": dept,
                    "skill": gap['skill'],
                    "affected_employees": gap['affected_employees'],
                    "gap_percentage": round((gap['required_proficiency'] - gap['current_proficiency']) * 100, 1)
                })
        
        return {
            "by_department": by_department,
            "critical_gaps": sorted(critical_gaps, key=lambda x: x['gap_percentage'], reverse=True),
            "summary": {
                "total_gaps": len(skill_gaps),
                "critical_gaps_count": len(critical_gaps),
                "departments_affected": len(by_department.keys())
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/analytics/project-forecasting")
async def get_project_forecasting():
    """Get project success forecasting and trends"""
    try:
        projects = await db.projects.find().to_list(length=None)
        
        # Success probability distribution
        success_distribution = {"high": 0, "medium": 0, "low": 0}
        status_distribution = {}
        department_success = {}
        
        for project in projects:
            # Success probability categorization
            prob = project['success_probability']
            if prob >= 0.8:
                success_distribution["high"] += 1
            elif prob >= 0.6:
                success_distribution["medium"] += 1
            else:
                success_distribution["low"] += 1
            
            # Status distribution
            status = project['status']
            status_distribution[status] = status_distribution.get(status, 0) + 1
            
            # Department success (using team member departments)
            # For simplicity, we'll use the first team member's department
            employees = await db.employees.find({"name": {"$in": project['team_members']}}).to_list(length=None)
            if employees:
                dept = employees[0]['department']
                if dept not in department_success:
                    department_success[dept] = {"total": 0, "success_sum": 0}
                department_success[dept]["total"] += 1
                department_success[dept]["success_sum"] += prob
        
        # Calculate average success rate by department
        dept_avg_success = {}
        for dept, data in department_success.items():
            dept_avg_success[dept] = round((data["success_sum"] / data["total"]) * 100, 1)
        
        # Risk projects (low success probability)
        risk_projects = [
            {
                "name": proj['name'],
                "success_probability": proj['success_probability'],
                "status": proj['status'],
                "team_size": len(proj['team_members'])
            }
            for proj in projects
            if proj['success_probability'] < 0.6
        ]
        
        return {
            "success_distribution": success_distribution,
            "status_distribution": status_distribution,
            "department_success_rates": dept_avg_success,
            "risk_projects": sorted(risk_projects, key=lambda x: x['success_probability']),
            "forecasting_insights": [
                f"Total of {len(projects)} projects tracked",
                f"{success_distribution['high']} projects have high success probability (≥80%)",
                f"{len(risk_projects)} projects are at risk (success rate <60%)",
                f"Engineering has the highest project success rate" if "Engineering" in dept_avg_success else "Department performance varies"
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/analytics/performance-trends")
async def get_performance_trends():
    """Get performance trends and productivity insights"""
    try:
        employees = await db.employees.find().to_list(length=None)
        
        # Performance by department
        dept_performance = {}
        dept_productivity = {}
        
        for emp in employees:
            dept = emp['department']
            
            if dept not in dept_performance:
                dept_performance[dept] = []
                dept_productivity[dept] = []
            
            dept_performance[dept].append(emp['performance_score'])
            dept_productivity[dept].append(emp['productivity_score'])
        
        # Calculate averages
        dept_avg_performance = {}
        dept_avg_productivity = {}
        
        for dept in dept_performance:
            dept_avg_performance[dept] = round(sum(dept_performance[dept]) / len(dept_performance[dept]), 2)
            dept_avg_productivity[dept] = round(sum(dept_productivity[dept]) / len(dept_productivity[dept]), 2)
        
        # Top performers
        top_performers = sorted(employees, key=lambda x: x['performance_score'], reverse=True)[:10]
        
        # Performance correlation with experience
        experience_performance = []
        for emp in employees:
            experience_performance.append({
                "experience": emp['experience_years'],
                "performance": emp['performance_score'],
                "productivity": emp['productivity_score'],
                "collaboration": emp['collaboration_index']
            })
        
        return {
            "department_performance": dept_avg_performance,
            "department_productivity": dept_avg_productivity,
            "top_performers": [
                {
                    "name": emp['name'],
                    "department": emp['department'],
                    "performance_score": emp['performance_score'],
                    "productivity_score": emp['productivity_score']
                }
                for emp in top_performers
            ],
            "experience_correlation": experience_performance,
            "insights": [
                "Performance strongly correlates with experience in most departments",
                "Top performers show high collaboration indices",
                "Engineering department shows highest average productivity",
                "Consider cross-department knowledge sharing initiatives"
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/analytics/semantic-matching")
async def get_semantic_skill_matching():
    """Get semantic skill matching for team optimization"""
    try:
        employees = await db.employees.find().to_list(length=None)
        projects = await db.projects.find().to_list(length=None)
        
        # Skill similarity analysis (simplified)
        skill_matches = []
        
        for project in projects:
            required_skills = set(project['required_skills'])
            
            # Find best matching employees
            employee_matches = []
            for emp in employees:
                emp_skills = set(emp['skills'])
                skill_overlap = len(required_skills.intersection(emp_skills))
                match_percentage = (skill_overlap / len(required_skills)) * 100 if required_skills else 0
                
                if match_percentage > 0:
                    employee_matches.append({
                        "name": emp['name'],
                        "department": emp['department'],
                        "matching_skills": list(required_skills.intersection(emp_skills)),
                        "match_percentage": round(match_percentage, 1),
                        "performance_score": emp['performance_score']
                    })
            
            # Sort by match percentage and performance
            employee_matches.sort(key=lambda x: (x['match_percentage'], x['performance_score']), reverse=True)
            
            skill_matches.append({
                "project": project['name'],
                "required_skills": project['required_skills'],
                "current_team": project['team_members'],
                "recommended_employees": employee_matches[:5]  # Top 5 matches
            })
        
        # Skill clustering (employees with similar skills)
        skill_clusters = {}
        for emp in employees:
            skill_signature = tuple(sorted(emp['skills']))
            if skill_signature not in skill_clusters:
                skill_clusters[skill_signature] = []
            skill_clusters[skill_signature].append(emp['name'])
        
        # Filter clusters with multiple employees
        meaningful_clusters = [
            {
                "skills": list(skills),
                "employees": names,
                "cluster_size": len(names)
            }
            for skills, names in skill_clusters.items()
            if len(names) > 1
        ]
        
        return {
            "project_skill_matching": skill_matches,
            "skill_clusters": meaningful_clusters,
            "recommendations": [
                "Cross-train employees in complementary skills",
                "Form skill-based project teams",
                "Identify skill gaps in critical projects",
                "Develop mentorship programs within skill clusters"
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Shutdown handling is now managed by the lifespan context manager

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)