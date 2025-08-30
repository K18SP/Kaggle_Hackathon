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
  Settings,
  Database,
  Loader2,
  Rocket,
  AlertCircle,
  Lightbulb,
  Building2,
  Clock,
  Layers,
  Code
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
        <Card className="glass-card p-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-600/5 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Employees</p>
              <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
                {data.metrics.total_employees}
              </p>
            </div>
            <div className="p-3 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors duration-300">
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </div>
        </Card>
        
        <Card className="glass-card p-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-green-600/5 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Active Projects</p>
              <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-800">
                {data.metrics.active_projects}
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-50 group-hover:bg-green-100 transition-colors duration-300">
              <Target className="h-8 w-8 text-green-500" />
            </div>
          </div>
        </Card>
        
        <Card className="glass-card p-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-purple-600/5 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Avg Performance</p>
              <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-800">
                {(data.metrics.avg_performance_score * 100).toFixed(0)}%
              </p>
            </div>
            <div className="p-3 rounded-full bg-purple-50 group-hover:bg-purple-100 transition-colors duration-300">
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </Card>
        
        <Card className="glass-card p-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-orange-600/5 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Productivity Score</p>
              <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-orange-800">
                {(data.metrics.avg_productivity_score * 100).toFixed(0)}%
              </p>
            </div>
            <div className="p-3 rounded-full bg-orange-50 group-hover:bg-orange-100 transition-colors duration-300">
              <Activity className="h-8 w-8 text-orange-500" />
            </div>
          </div>
        </Card>
        
        <Card className="glass-card p-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-teal-600/5 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-teal-600">Project Success Rate</p>
              <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-teal-800">
                {data.metrics.avg_project_success_rate}%
              </p>
            </div>
            <div className="p-3 rounded-full bg-teal-50 group-hover:bg-teal-100 transition-colors duration-300">
              <Award className="h-8 w-8 text-teal-500" />
            </div>
          </div>
        </Card>
        
        <Card className="glass-card p-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-indigo-600">Total Projects</p>
              <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-800">
                {data.metrics.total_projects}
              </p>
            </div>
            <div className="p-3 rounded-full bg-indigo-50 group-hover:bg-indigo-100 transition-colors duration-300">
              <BarChart3 className="h-8 w-8 text-indigo-500" />
            </div>
          </div>
        </Card>
      </div>

      {/* Department Distribution */}
      <Card className="modern-card p-6 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 opacity-50"></div>
        <h3 className="relative text-lg font-semibold mb-4 flex items-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
          <Users className="w-5 h-5 mr-2 text-indigo-600" />
          Department Distribution
        </h3>
        <div className="relative grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(data.department_distribution).map(([dept, count]) => (
            <div key={dept} className="glass-card text-center p-4 hover:bg-white/90 transition-all duration-300">
              <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">{count}</p>
              <p className="text-sm text-gray-600 mt-1">{dept}</p>
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
      <Card className="modern-card p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-indigo-50/30 opacity-50"></div>
        <h3 className="relative text-lg font-semibold mb-4 flex items-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          <Network className="w-5 h-5 mr-2 text-blue-600" />
          Collaboration Network Analysis
        </h3>
        
        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Network Stats */}
          <div className="glass-card p-6 space-y-4 hover:bg-white/90 transition-all duration-300">
            <h4 className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Network Statistics</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 hover:bg-blue-50/50 rounded-lg transition-colors duration-200">
                <span className="text-sm text-gray-600 flex items-center">
                  <div className="w-2 h-2 rounded-full bg-blue-400 mr-2"></div>
                  Total Connections
                </span>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">{data.edges.length}</Badge>
              </div>
              <div className="flex justify-between items-center p-2 hover:bg-indigo-50/50 rounded-lg transition-colors duration-200">
                <span className="text-sm text-gray-600 flex items-center">
                  <div className="w-2 h-2 rounded-full bg-indigo-400 mr-2"></div>
                  Active Collaborators
                </span>
                <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200">{data.nodes.length}</Badge>
              </div>
              <div className="flex justify-between items-center p-2 hover:bg-purple-50/50 rounded-lg transition-colors duration-200">
                <span className="text-sm text-gray-600 flex items-center">
                  <div className="w-2 h-2 rounded-full bg-purple-400 mr-2"></div>
                  Avg Connection Strength
                </span>
                <Badge variant="secondary" className="bg-purple-100 text-purple-700 hover:bg-purple-200">
                  {(data.edges.reduce((sum, edge) => sum + edge.strength, 0) / data.edges.length).toFixed(2)}
                </Badge>
              </div>
            </div>
          </div>
          
          {/* Top Collaborators */}
          <div className="glass-card p-6 space-y-4 hover:bg-white/90 transition-all duration-300">
            <h4 className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Top Collaborators</h4>
            <div className="space-y-3">
              {data.nodes
                .sort((a, b) => b.collaboration_index - a.collaboration_index)
                .slice(0, 5)
                .map((node, index) => (
                  <div 
                    key={node.id} 
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-300 border border-transparent hover:border-blue-100"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                        <span className="text-sm font-semibold text-blue-600">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">{node.name}</p>
                        <p className="text-xs text-gray-600">{node.department}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700">
                      {(node.collaboration_index * 100).toFixed(0)}%
                    </Badge>
                  </div>
                ))}
            </div>
          </div>
        </div>
        
        {/* Department Collaboration */}
        <div className="mt-6">
          <h4 className="font-medium mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Department Collaboration Patterns</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from(new Set(data.nodes.map(n => n.department))).map((dept, index) => {
              const deptNodes = data.nodes.filter(n => n.department === dept);
              const avgCollaboration = deptNodes.reduce((sum, node) => sum + node.collaboration_index, 0) / deptNodes.length;
              const gradients = [
                'from-blue-700 to-indigo-700 text-white',
                'from-indigo-700 to-purple-700 text-white',
                'from-purple-700 to-blue-700 text-white'
              ];
              const gradient = gradients[index % gradients.length];
              
              return (
                <div 
                  key={dept} 
                  className={`glass-card p-4 text-center hover:bg-white/90 transition-all duration-300 hover:transform hover:-translate-y-1`}
                >
                  <p className="text-sm font-medium text-gray-700">{dept}</p>
                  <p className="text-lg font-bold mt-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700">
                    {(avgCollaboration * 100).toFixed(0)}%
                  </p>
                  <p className="text-xs text-gray-600 mt-1">{deptNodes.length} members</p>
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
        <Card className="modern-card p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-50/30 to-orange-50/30 opacity-50"></div>
          <h3 className="relative text-lg font-semibold mb-4 flex items-center bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-orange-600">
            <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
            Critical Skill Gaps ({data.critical_gaps.length})
          </h3>
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.critical_gaps.slice(0, 4).map((gap, index) => (
              <div key={index} className="glass-card p-4 hover:bg-white/90 transition-all duration-300 border-red-100">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-orange-600">{gap.skill}</p>
                    <p className="text-sm text-gray-600">{gap.department}</p>
                  </div>
                  <Badge variant="destructive" className="bg-gradient-to-r from-red-500 to-orange-500">{gap.gap_percentage}% gap</Badge>
                </div>
                <p className="text-sm text-gray-700 flex items-center">
                  <Users className="w-4 h-4 mr-1 text-red-400" />
                  {gap.affected_employees} employees affected
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Department Skill Analysis */}
      <Card className="modern-card p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 to-blue-50/30 opacity-50"></div>
        <h3 className="relative text-lg font-semibold mb-4 flex items-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
          <BookOpen className="w-5 h-5 mr-2 text-purple-500" />
          Skill Gap Analysis by Department
        </h3>
        
        <div className="relative space-y-6">
          {Object.entries(data.by_department).map(([dept, gaps]) => (
            <div key={dept} className="glass-card p-6 hover:bg-white/90 transition-all duration-300">
              <h4 className="font-medium mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">{dept} Department</h4>
              <div className="space-y-4">
                {gaps.map((gap, index) => (
                  <div key={index} className="space-y-3 p-3 rounded-lg hover:bg-gradient-to-r hover:from-purple-50/30 hover:to-blue-50/30 transition-all duration-300">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm">{gap.skill}</span>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={gap.gap_level === 'critical' ? 'destructive' : 
                                 gap.gap_level === 'moderate' ? 'default' : 'secondary'}
                          className={gap.gap_level === 'critical' ? 'bg-gradient-to-r from-red-500 to-orange-500' :
                                   gap.gap_level === 'moderate' ? 'bg-gradient-to-r from-orange-500 to-yellow-500' :
                                   'bg-gradient-to-r from-green-500 to-emerald-500'}
                        >
                          {gap.gap_level}
                        </Badge>
                        <span className="text-sm text-gray-600">{gap.gap_percentage}% gap</span>
                      </div>
                    </div>
                    <div className="relative">
                      <Progress 
                        value={gap.current_proficiency * 100} 
                        className="h-2 bg-gray-100 overflow-hidden" 
                        indicatorClassName={`bg-gradient-to-r ${gap.gap_level === 'critical' ? 'from-red-500 to-orange-500' :
                                          gap.gap_level === 'moderate' ? 'from-orange-500 to-yellow-500' :
                                          'from-green-500 to-emerald-500'}`}
                      />
                    </div>
                    <div className="text-xs text-gray-600 flex items-center justify-between">
                      <span>Current: {(gap.current_proficiency * 100).toFixed(0)}% |</span> 
                      <span>Required: {(gap.required_proficiency * 100).toFixed(0)}%</span>
                       <span className="flex items-center">
                         <Users className="w-3 h-3 mr-1 text-gray-400" />
                         {gap.affected_employees} affected
                       </span>
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
        <Card className="modern-card p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/30 to-teal-50/30 opacity-50"></div>
          <h3 className="relative text-lg font-semibold mb-4 flex items-center bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">
            <Target className="w-5 h-5 mr-2 text-emerald-500" />
            Project Success Distribution
          </h3>
          <div className="relative space-y-4">
            <div className="glass-card flex justify-between items-center p-4 hover:bg-white/90 transition-all duration-300">
              <span className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">High Success (≥80%)</span>
              <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500">{data.success_distribution.high} projects</Badge>
            </div>
            <div className="glass-card flex justify-between items-center p-4 hover:bg-white/90 transition-all duration-300">
              <span className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-yellow-600 to-orange-600">Medium Success (60-79%)</span>
              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500">{data.success_distribution.medium} projects</Badge>
            </div>
            <div className="glass-card flex justify-between items-center p-4 hover:bg-white/90 transition-all duration-300">
              <span className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-orange-600">Low Success (&lt;60%)</span>
              <Badge className="bg-gradient-to-r from-red-500 to-orange-500">{data.success_distribution.low} projects</Badge>
            </div>
          </div>
        </Card>

        <Card className="modern-card p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-50/30 to-purple-50/30 opacity-50"></div>
          <h3 className="relative text-lg font-semibold mb-4 flex items-center bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-purple-600">
            <Activity className="w-5 h-5 mr-2 text-violet-500" />
            Project Status Overview
          </h3>
          <div className="relative space-y-3">
            {Object.entries(data.status_distribution).map(([status, count]) => (
              <div key={status} className="glass-card flex justify-between items-center p-4 hover:bg-white/90 transition-all duration-300">
                <span className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-purple-600">{status}</span>
                <Badge className="bg-gradient-to-r from-violet-500 to-purple-500">{count}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Department Success Rates */}
      <Card className="modern-card p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/30 to-blue-50/30 opacity-50"></div>
        <h3 className="relative text-lg font-semibold mb-4 flex items-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-600">
          <BarChart3 className="w-5 h-5 mr-2 text-cyan-500" />
          Success Rates by Department
        </h3>
        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(data.department_success_rates).map(([dept, rate]) => (
            <div key={dept} className="glass-card p-6 hover:bg-white/90 transition-all duration-300">
              <p className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-600">{dept}</p>
              <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-600">{rate}%</p>
              <div className="relative mt-2">
                <Progress 
                  value={rate} 
                  className="h-2 bg-gray-100 overflow-hidden" 
                  indicatorClassName="bg-gradient-to-r from-cyan-500 to-blue-500"
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Risk Projects */}
      {data.risk_projects.length > 0 && (
        <Card className="modern-card p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 to-red-50/30 opacity-50"></div>
          <h3 className="relative text-lg font-semibold mb-4 flex items-center bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-red-600">
            <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
            Projects at Risk ({data.risk_projects.length})
          </h3>
          <div className="relative space-y-4">
            {data.risk_projects.map((project, index) => (
              <div key={index} className="glass-card p-6 hover:bg-white/90 transition-all duration-300 border-orange-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-red-600">{project.name}</p>
                    <p className="text-sm text-gray-600 flex items-center mt-1">
                      <AlertCircle className="w-4 h-4 mr-1 text-orange-400" />
                      Status: {project.status}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center mt-1">
                      <Users className="w-4 h-4 mr-1 text-orange-400" />
                      Team Size: {project.team_size}
                    </p>
                  </div>
                  <Badge 
                    variant="destructive"
                    className="bg-gradient-to-r from-orange-500 to-red-500"
                  >
                    {(project.success_probability * 100).toFixed(0)}% success
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Insights */}
      <Card className="modern-card p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 to-purple-50/30 opacity-50"></div>
        <h3 className="relative text-lg font-semibold mb-4 flex items-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
          <Brain className="w-5 h-5 mr-2 text-indigo-500" />
          Forecasting Insights
        </h3>
        <div className="relative space-y-3">
          {data.forecasting_insights.map((insight, index) => (
            <div key={index} className="glass-card p-4 hover:bg-white/90 transition-all duration-300">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="w-4 h-4 text-white" />
                </div>
                <p className="text-sm text-gray-700 pt-1">{insight}</p>
              </div>
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
        <Card className="modern-card p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/30 to-teal-50/30 opacity-50"></div>
          <h3 className="relative text-lg font-semibold mb-4 flex items-center bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">
            <TrendingUp className="w-5 h-5 mr-2 text-emerald-500" />
            Performance by Department
          </h3>
          <div className="relative space-y-4">
            {Object.entries(data.department_performance)
              .sort(([,a], [,b]) => b - a)
              .map(([dept, score]) => (
                <div key={dept} className="glass-card p-4 hover:bg-white/90 transition-all duration-300">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">{dept}</span>
                    <span className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">
                      {(score * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="relative">
                    <Progress 
                      value={score * 100} 
                      className="h-2 bg-gray-100 overflow-hidden" 
                      indicatorClassName="bg-gradient-to-r from-emerald-500 to-teal-500"
                    />
                  </div>
                </div>
              ))}
          </div>
        </Card>

        <Card className="modern-card p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-indigo-50/30 opacity-50"></div>
          <h3 className="relative text-lg font-semibold mb-4 flex items-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            <Activity className="w-5 h-5 mr-2 text-blue-500" />
            Productivity by Department
          </h3>
          <div className="relative space-y-4">
            {Object.entries(data.department_productivity)
              .sort(([,a], [,b]) => b - a)
              .map(([dept, score]) => (
                <div key={dept} className="glass-card p-4 hover:bg-white/90 transition-all duration-300">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">{dept}</span>
                    <span className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                      {(score * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="relative">
                    <Progress 
                      value={score * 100} 
                      className="h-2 bg-gray-100 overflow-hidden" 
                      indicatorClassName="bg-gradient-to-r from-blue-500 to-indigo-500"
                    />
                  </div>
                </div>
              ))}
          </div>
        </Card>
      </div>

      {/* Top Performers */}
      <Card className="modern-card p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/30 to-yellow-50/30 opacity-50"></div>
        <h3 className="relative text-lg font-semibold mb-4 flex items-center bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-yellow-600">
          <Award className="w-5 h-5 mr-2 text-amber-500" />
          Top Performers
        </h3>
        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.top_performers.slice(0, 9).map((performer, index) => (
            <div key={index} className="glass-card p-6 hover:bg-white/90 transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-yellow-600">{performer.name}</p>
                  <p className="text-sm text-gray-600 flex items-center mt-1">
                    <Building2 className="w-4 h-4 mr-1 text-amber-400" />
                    {performer.department}
                  </p>
                </div>
                <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500">#{index + 1}</Badge>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 rounded-lg hover:bg-gradient-to-r hover:from-amber-50/30 hover:to-yellow-50/30 transition-all duration-300">
                  <span className="text-sm flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1 text-amber-400" />
                    Performance
                  </span>
                  <span className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-yellow-600">
                    {(performer.performance_score * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg hover:bg-gradient-to-r hover:from-amber-50/30 hover:to-yellow-50/30 transition-all duration-300">
                  <span className="text-sm flex items-center">
                    <Activity className="w-4 h-4 mr-1 text-amber-400" />
                    Productivity
                  </span>
                  <span className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-yellow-600">
                    {(performer.productivity_score * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Experience Correlation */}
      <Card className="modern-card p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50/30 to-fuchsia-50/30 opacity-50"></div>
        <h3 className="relative text-lg font-semibold mb-4 flex items-center bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-fuchsia-600">
          <Calendar className="w-5 h-5 mr-2 text-violet-500" />
          Experience vs Performance Analysis
        </h3>
        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              <div key={range} className="glass-card p-6 hover:bg-white/90 transition-all duration-300 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <p className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-fuchsia-600">{range}</p>
                <p className="text-3xl font-bold mt-2 bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-fuchsia-600">
                  {(avgPerformance * 100).toFixed(0)}%
                </p>
                <p className="text-sm text-gray-600 mt-2 flex items-center justify-center">
                  <Users className="w-4 h-4 mr-1 text-violet-400" />
                  {groupData.length} employees
                </p>
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
      <Card className="modern-card p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/30 to-blue-50/30 opacity-50"></div>
        <h3 className="relative text-lg font-semibold mb-4 flex items-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-600">
          <Network className="w-5 h-5 mr-2 text-cyan-500" />
          Skill-Based Employee Clusters
        </h3>
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.skill_clusters
            .sort((a, b) => b.cluster_size - a.cluster_size)
            .slice(0, 6)
            .map((cluster, index) => (
              <div key={index} className="glass-card p-6 hover:bg-white/90 transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-600 flex items-center">
                    <Layers className="w-4 h-4 mr-2 text-cyan-500" />
                    Cluster {index + 1}
                  </h4>
                  <Badge className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
                    {cluster.cluster_size} members
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-cyan-700 mb-2 flex items-center">
                      <Code className="w-4 h-4 mr-1 text-cyan-500" />
                      Common Skills:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {cluster.skills.map((skill, skillIndex) => (
                        <Badge 
                          key={skillIndex} 
                          variant="outline" 
                          className="text-xs bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-700 border-cyan-200"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-cyan-700 mb-2 flex items-center">
                      <Users className="w-4 h-4 mr-1 text-cyan-500" />
                      Team Members:
                    </p>
                    <div className="text-sm text-cyan-600 bg-gradient-to-r from-cyan-50 to-blue-50 p-2 rounded-md">
                      {cluster.employees.join(", ")}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </Card>

      {/* Recommendations */}
      <Card className="modern-card p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 to-purple-50/30 opacity-50"></div>
        <h3 className="relative text-lg font-semibold mb-4 flex items-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
          <Brain className="w-5 h-5 mr-2 text-indigo-500" />
          Semantic Matching Recommendations
        </h3>
        <div className="relative space-y-3">
          {data.recommendations.map((recommendation, index) => (
            <div key={index} className="glass-card p-4 hover:bg-white/90 transition-all duration-300 flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-4 h-4 text-white" />
              </div>
              <p className="text-sm text-indigo-700 flex-grow">{recommendation}</p>
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
      <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                  Workforce Productivity Analytics
                </h1>
                <p className="text-sm text-gray-600">
                  BigQuery AI-Powered Insights Platform
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {!dataInitialized && (
                <Button 
                  onClick={initializeData} 
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg transition-all duration-300"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Initializing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Database className="w-4 h-4" />
                      <span>Initialize Sample Data</span>
                    </div>
                  )}
                </Button>
              )}
              <Badge 
                variant="outline" 
                className="flex items-center space-x-2 bg-gradient-to-r from-green-50 to-emerald-50 text-emerald-700 border-emerald-200"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <Settings className="w-3 h-3 text-emerald-500" />
                <span>BigQuery Connected</span>
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-cyan-50/50 pointer-events-none"></div>
        <div className="relative">
          {!dataInitialized ? (
          <div className="glass-card max-w-2xl mx-auto text-center py-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-cyan-50/30 opacity-50"></div>
            <div className="relative">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-xl">
                <Brain className="h-12 w-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                Welcome to Workforce Analytics
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Initialize sample data to start exploring AI-powered workforce insights
              </p>
              <Button 
                onClick={initializeData} 
                disabled={loading}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg transition-all duration-300 px-8 py-3 text-lg"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-3">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Setting up analytics...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-3">
                    <Rocket className="w-5 h-5" />
                    <span>Get Started</span>
                  </div>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 glass-card p-1 gap-1 bg-white/50">
              <TabsTrigger 
                value="overview" 
                className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white transition-all duration-300"
              >
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger 
                value="collaboration" 
                className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white transition-all duration-300"
              >
                <Network className="w-4 h-4" />
                <span className="hidden sm:inline">Network</span>
              </TabsTrigger>
              <TabsTrigger 
                value="skills" 
                className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white transition-all duration-300"
              >
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Skills</span>
              </TabsTrigger>
              <TabsTrigger 
                value="forecasting" 
                className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white transition-all duration-300"
              >
                <Target className="w-4 h-4" />
                <span className="hidden sm:inline">Projects</span>
              </TabsTrigger>
              <TabsTrigger 
                value="performance" 
                className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white transition-all duration-300"
              >
                <TrendingUp className="w-4 h-4" />
                <span className="hidden sm:inline">Performance</span>
              </TabsTrigger>
              <TabsTrigger 
                value="semantic" 
                className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white transition-all duration-300"
              >
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
        </div>
      </main>
    </div>
  );
}

export default App;