import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { JobMarketInsight } from "@/types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts";

// Mock data for job market insights
const jobMarketData: Record<string, JobMarketInsight> = {
  "fullstack": {
    role: "Full Stack Developer",
    skillDemand: [
      { name: "React", percentage: 85 },
      { name: "Node.js", percentage: 78 },
      { name: "TypeScript", percentage: 72 },
      { name: "AWS", percentage: 65 },
      { name: "MongoDB", percentage: 60 },
    ],
    salaryRange: {
      min: 70000,
      max: 130000,
      median: 95000
    },
    growthRate: 24,
    openings: 12500,
    locations: [
      { name: "San Francisco", percentage: 22 },
      { name: "New York", percentage: 18 },
      { name: "Seattle", percentage: 14 },
      { name: "Austin", percentage: 11 },
      { name: "Boston", percentage: 9 }
    ]
  },
  "frontend": {
    role: "Frontend Developer",
    skillDemand: [
      { name: "React", percentage: 90 },
      { name: "TypeScript", percentage: 75 },
      { name: "CSS/SCSS", percentage: 85 },
      { name: "Vue.js", percentage: 45 },
      { name: "Angular", percentage: 40 },
    ],
    salaryRange: {
      min: 65000,
      max: 120000,
      median: 90000
    },
    growthRate: 20,
    openings: 9800,
    locations: [
      { name: "San Francisco", percentage: 20 },
      { name: "New York", percentage: 17 },
      { name: "Los Angeles", percentage: 12 },
      { name: "Chicago", percentage: 10 },
      { name: "Seattle", percentage: 9 }
    ]
  },
  "backend": {
    role: "Backend Developer",
    skillDemand: [
      { name: "Node.js", percentage: 70 },
      { name: "Python", percentage: 75 },
      { name: "Java", percentage: 65 },
      { name: "AWS", percentage: 80 },
      { name: "SQL", percentage: 85 },
    ],
    salaryRange: {
      min: 75000,
      max: 140000,
      median: 100000
    },
    growthRate: 22,
    openings: 8700,
    locations: [
      { name: "Seattle", percentage: 21 },
      { name: "San Francisco", percentage: 19 },
      { name: "New York", percentage: 15 },
      { name: "Austin", percentage: 12 },
      { name: "Boston", percentage: 8 }
    ]
  },
  "data": {
    role: "Data Scientist",
    skillDemand: [
      { name: "Python", percentage: 95 },
      { name: "SQL", percentage: 85 },
      { name: "Machine Learning", percentage: 80 },
      { name: "TensorFlow", percentage: 65 },
      { name: "Data Visualization", percentage: 70 },
    ],
    salaryRange: {
      min: 85000,
      max: 160000,
      median: 115000
    },
    growthRate: 31,
    openings: 6800,
    locations: [
      { name: "San Francisco", percentage: 25 },
      { name: "New York", percentage: 20 },
      { name: "Seattle", percentage: 15 },
      { name: "Boston", percentage: 12 },
      { name: "Chicago", percentage: 8 }
    ]
  },
  "cloud": {
    role: "Cloud Engineer",
    skillDemand: [
      { name: "AWS", percentage: 90 },
      { name: "Kubernetes", percentage: 75 },
      { name: "Docker", percentage: 80 },
      { name: "Terraform", percentage: 65 },
      { name: "Python", percentage: 60 },
    ],
    salaryRange: {
      min: 80000,
      max: 150000,
      median: 110000
    },
    growthRate: 27,
    openings: 7500,
    locations: [
      { name: "Seattle", percentage: 24 },
      { name: "San Francisco", percentage: 20 },
      { name: "New York", percentage: 14 },
      { name: "Austin", percentage: 11 },
      { name: "Denver", percentage: 9 }
    ]
  }
};

// Comparison data for selected roles
const comparisonData = [
  { name: 'Median Salary (K)', fullstack: 95, frontend: 90, backend: 100, data: 115, cloud: 110 },
  { name: 'Growth Rate (%)', fullstack: 24, frontend: 20, backend: 22, data: 31, cloud: 27 },
  { name: 'Job Openings (K)', fullstack: 12.5, frontend: 9.8, backend: 8.7, data: 6.8, cloud: 7.5 },
];

// Color mapping for charts
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function JobMarket() {
  const [selectedRole, setSelectedRole] = useState("fullstack");
  const [compareRole, setCompareRole] = useState("");
  const [activeTab, setActiveTab] = useState("trending");
  
  const currentRole = jobMarketData[selectedRole];
  const comparisonRole = compareRole ? jobMarketData[compareRole] : null;

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Format large numbers with K suffix
  const formatWithK = (value: number) => {
    return value >= 1000 ? `${(value / 1000).toFixed(1)}K` : value;
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Job Market Insights</h1>
        <p className="text-gray-600">Analyze trends, compare roles, and make informed career decisions</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="w-full bg-white border border-gray-200 p-1 shadow-sm">
          <TabsTrigger value="trending" className="flex-1">Trending Careers</TabsTrigger>
          <TabsTrigger value="compare" className="flex-1">Career Comparison</TabsTrigger>
          <TabsTrigger value="salary" className="flex-1">Salary Insights</TabsTrigger>
          <TabsTrigger value="location" className="flex-1">Location Analysis</TabsTrigger>
        </TabsList>

        {/* Trending Careers Tab */}
        <TabsContent value="trending" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Tech Roles in Demand</CardTitle>
              <CardDescription>
                Most sought-after tech roles based on job postings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { role: "Full Stack Developer", openings: 12500 },
                      { role: "Frontend Developer", openings: 9800 },
                      { role: "Backend Developer", openings: 8700 },
                      { role: "Cloud Engineer", openings: 7500 },
                      { role: "Data Scientist", openings: 6800 },
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="role" />
                    <YAxis label={{ value: 'Job Openings', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value) => [`${formatWithK(value as number)} openings`, "Job Openings"]} />
                    <Bar dataKey="openings" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Fastest Growing Tech Roles</CardTitle>
                <CardDescription>
                  Projected growth rate over the next 5 years
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { role: "Data Scientist", growth: 31 },
                        { role: "Cloud Engineer", growth: 27 },
                        { role: "Full Stack Developer", growth: 24 },
                        { role: "Backend Developer", growth: 22 },
                        { role: "Frontend Developer", growth: 20 },
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" unit="%" />
                      <YAxis dataKey="role" type="category" width={150} />
                      <Tooltip formatter={(value) => [`${value}%`, "Growth Rate"]} />
                      <Bar dataKey="growth" fill="#10b981" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Median Salary Comparison</CardTitle>
                <CardDescription>
                  Average annual compensation by role
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { role: "Data Scientist", salary: 115000 },
                        { role: "Cloud Engineer", salary: 110000 },
                        { role: "Backend Developer", salary: 100000 },
                        { role: "Full Stack Developer", salary: 95000 },
                        { role: "Frontend Developer", salary: 90000 },
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="role" type="category" width={150} />
                      <Tooltip formatter={(value) => [formatCurrency(value as number), "Median Salary"]} />
                      <Bar dataKey="salary" fill="#f59e0b" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Career Comparison Tab */}
        <TabsContent value="compare" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Select Roles to Compare</CardTitle>
                <CardDescription>
                  Compare key metrics between different career paths
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="primary-role">Primary Role</Label>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger id="primary-role">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fullstack">Full Stack Developer</SelectItem>
                      <SelectItem value="frontend">Frontend Developer</SelectItem>
                      <SelectItem value="backend">Backend Developer</SelectItem>
                      <SelectItem value="data">Data Scientist</SelectItem>
                      <SelectItem value="cloud">Cloud Engineer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="compare-role">Compare With (Optional)</Label>
                  <Select value={compareRole} onValueChange={setCompareRole}>
                    <SelectTrigger id="compare-role">
                      <SelectValue placeholder="Select a role to compare" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {Object.entries(jobMarketData).map(([key, data]) => (
                        key !== selectedRole && <SelectItem key={key} value={key}>{data.role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Skill Gap Analysis</CardTitle>
                <CardDescription>
                  Skills demanded for {currentRole.role}{compareRole && ` vs ${comparisonRole?.role}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentRole.skillDemand.map((skill, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                        <span className="text-xs text-gray-500">{skill.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary-600 h-2 rounded-full" 
                          style={{ width: `${skill.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Career Metrics Comparison</CardTitle>
              <CardDescription>
                Key metrics for {currentRole.role}{compareRole && ` compared to ${comparisonRole?.role}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-500">Median Salary</p>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {formatCurrency(currentRole.salaryRange.median)}
                  </h3>
                  {compareRole && (
                    <p className={`text-sm mt-1 ${comparisonRole!.salaryRange.median > currentRole.salaryRange.median ? 'text-red-500' : 'text-green-500'}`}>
                      {comparisonRole!.salaryRange.median > currentRole.salaryRange.median ? '↓' : '↑'} 
                      {' '}
                      {formatCurrency(Math.abs(comparisonRole!.salaryRange.median - currentRole.salaryRange.median))} difference
                    </p>
                  )}
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-500">Job Openings</p>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {formatWithK(currentRole.openings)}
                  </h3>
                  {compareRole && (
                    <p className={`text-sm mt-1 ${comparisonRole!.openings > currentRole.openings ? 'text-red-500' : 'text-green-500'}`}>
                      {comparisonRole!.openings > currentRole.openings ? '↓' : '↑'} 
                      {' '}
                      {formatWithK(Math.abs(comparisonRole!.openings - currentRole.openings))} difference
                    </p>
                  )}
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-500">Growth Rate</p>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {currentRole.growthRate}%
                  </h3>
                  {compareRole && (
                    <p className={`text-sm mt-1 ${comparisonRole!.growthRate > currentRole.growthRate ? 'text-red-500' : 'text-green-500'}`}>
                      {comparisonRole!.growthRate > currentRole.growthRate ? '↓' : '↑'} 
                      {' '}
                      {Math.abs(comparisonRole!.growthRate - currentRole.growthRate)}% difference
                    </p>
                  )}
                </div>
              </div>

              {compareRole && (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { 
                          name: 'Median Salary (K)', 
                          [currentRole.role]: currentRole.salaryRange.median / 1000, 
                          [comparisonRole!.role]: comparisonRole!.salaryRange.median / 1000 
                        },
                        { 
                          name: 'Growth Rate (%)', 
                          [currentRole.role]: currentRole.growthRate, 
                          [comparisonRole!.role]: comparisonRole!.growthRate 
                        },
                        { 
                          name: 'Job Openings (K)', 
                          [currentRole.role]: currentRole.openings / 1000, 
                          [comparisonRole!.role]: comparisonRole!.openings / 1000 
                        },
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey={currentRole.role} fill="#3b82f6" />
                      <Bar dataKey={comparisonRole!.role} fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Salary Insights Tab */}
        <TabsContent value="salary" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Salary Range by Role</CardTitle>
              <CardDescription>
                Comparison of salary ranges across different tech roles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={Object.values(jobMarketData).map(data => ({
                      role: data.role,
                      min: data.salaryRange.min,
                      median: data.salaryRange.median,
                      max: data.salaryRange.max
                    }))}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="role" />
                    <YAxis />
                    <Tooltip formatter={(value) => [formatCurrency(value as number), ""]} />
                    <Legend />
                    <Bar dataKey="min" name="Minimum" fill="#94a3b8" />
                    <Bar dataKey="median" name="Median" fill="#3b82f6" />
                    <Bar dataKey="max" name="Maximum" fill="#1d4ed8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Salary by Experience Level</CardTitle>
                <CardDescription>
                  How experience impacts compensation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { years: "0-1", fullstack: 70, frontend: 65, backend: 72, data: 80, cloud: 75 },
                        { years: "1-3", fullstack: 85, frontend: 80, backend: 88, data: 95, cloud: 90 },
                        { years: "3-5", fullstack: 105, frontend: 95, backend: 110, data: 120, cloud: 115 },
                        { years: "5-8", fullstack: 125, frontend: 110, backend: 130, data: 140, cloud: 135 },
                        { years: "8+", fullstack: 145, frontend: 130, backend: 150, data: 165, cloud: 155 },
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="years" label={{ value: 'Years of Experience', position: 'insideBottom', offset: -5 }} />
                      <YAxis label={{ value: 'Salary (K USD)', angle: -90, position: 'insideLeft' }} />
                      <Tooltip formatter={(value) => [formatCurrency((value as number) * 1000), ""]} />
                      <Legend />
                      <Line type="monotone" dataKey="fullstack" name="Full Stack" stroke="#3b82f6" />
                      <Line type="monotone" dataKey="frontend" name="Frontend" stroke="#10b981" />
                      <Line type="monotone" dataKey="backend" name="Backend" stroke="#f59e0b" />
                      <Line type="monotone" dataKey="data" name="Data Science" stroke="#ef4444" />
                      <Line type="monotone" dataKey="cloud" name="Cloud" stroke="#8b5cf6" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Salary Distribution</CardTitle>
                <CardDescription>
                  Distribution of salaries across experience levels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "$60K-$80K", value: 15 },
                          { name: "$80K-$100K", value: 30 },
                          { name: "$100K-$120K", value: 25 },
                          { name: "$120K-$140K", value: 15 },
                          { name: "$140K+", value: 15 },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {[0, 1, 2, 3, 4].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Location Analysis Tab */}
        <TabsContent value="location" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Locations for Tech Jobs</CardTitle>
              <CardDescription>
                Cities with the highest concentration of tech opportunities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { location: "San Francisco", percentage: 22 },
                      { location: "New York", percentage: 18 },
                      { location: "Seattle", percentage: 15 },
                      { location: "Austin", percentage: 12 },
                      { location: "Boston", percentage: 9 },
                      { location: "Los Angeles", percentage: 8 },
                      { location: "Chicago", percentage: 7 },
                      { location: "Denver", percentage: 5 },
                      { location: "Atlanta", percentage: 4 },
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" unit="%" />
                    <YAxis dataKey="location" type="category" width={100} />
                    <Tooltip formatter={(value) => [`${value}%`, "Percentage of Jobs"]} />
                    <Bar dataKey="percentage" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Location Distribution</CardTitle>
                    <CardDescription>
                      Where are {currentRole.role} roles located?
                    </CardDescription>
                  </div>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fullstack">Full Stack Developer</SelectItem>
                      <SelectItem value="frontend">Frontend Developer</SelectItem>
                      <SelectItem value="backend">Backend Developer</SelectItem>
                      <SelectItem value="data">Data Scientist</SelectItem>
                      <SelectItem value="cloud">Cloud Engineer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={currentRole.locations}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="percentage"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {currentRole.locations.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Remote Work Opportunities</CardTitle>
                <CardDescription>
                  Percentage of remote vs. on-site positions by role
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { role: "Full Stack", remote: 45, hybrid: 30, onsite: 25 },
                        { role: "Frontend", remote: 50, hybrid: 30, onsite: 20 },
                        { role: "Backend", remote: 40, hybrid: 35, onsite: 25 },
                        { role: "Data Science", remote: 35, hybrid: 40, onsite: 25 },
                        { role: "Cloud", remote: 55, hybrid: 30, onsite: 15 },
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      stackOffset="expand"
                      layout="vertical"
                      stackId="a"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" unit="%" tickFormatter={(value) => `${value * 100}`} />
                      <YAxis dataKey="role" type="category" width={100} />
                      <Tooltip formatter={(value) => [`${(value as number * 100).toFixed(0)}%`, ""]} />
                      <Legend />
                      <Bar dataKey="remote" name="Remote" fill="#3b82f6" />
                      <Bar dataKey="hybrid" name="Hybrid" fill="#10b981" />
                      <Bar dataKey="onsite" name="On-site" fill="#f59e0b" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
