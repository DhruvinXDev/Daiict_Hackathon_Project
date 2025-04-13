import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { SkillAssessment } from "@/types";

export default function SkillAnalysis() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Mock skill assessment data
  const skillAssessments: SkillAssessment[] = [
    {
      category: "Technical Skills",
      skills: [
        { name: "JavaScript", proficiency: 85, industry: 90, gap: 5 },
        { name: "React", proficiency: 80, industry: 85, gap: 5 },
        { name: "HTML/CSS", proficiency: 90, industry: 80, gap: -10 },
        { name: "Node.js", proficiency: 70, industry: 80, gap: 10 },
        { name: "TypeScript", proficiency: 65, industry: 75, gap: 10 },
        { name: "SQL", proficiency: 60, industry: 70, gap: 10 }
      ]
    },
    {
      category: "Soft Skills",
      skills: [
        { name: "Communication", proficiency: 85, industry: 90, gap: 5 },
        { name: "Teamwork", proficiency: 90, industry: 85, gap: -5 },
        { name: "Problem Solving", proficiency: 80, industry: 85, gap: 5 },
        { name: "Time Management", proficiency: 75, industry: 80, gap: 5 },
        { name: "Adaptability", proficiency: 85, industry: 80, gap: -5 }
      ]
    },
    {
      category: "Tools & Frameworks",
      skills: [
        { name: "Git", proficiency: 80, industry: 85, gap: 5 },
        { name: "Webpack", proficiency: 65, industry: 70, gap: 5 },
        { name: "Jest", proficiency: 70, industry: 75, gap: 5 },
        { name: "Docker", proficiency: 50, industry: 70, gap: 20 },
        { name: "AWS", proficiency: 40, industry: 75, gap: 35 }
      ]
    }
  ];
  
  // Filter skills based on search term
  const filteredSkills = skillAssessments.map(category => ({
    ...category,
    skills: category.skills.filter(skill => 
      skill.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.skills.length > 0);
  
  // Learning recommendations based on skill gaps
  const learningRecommendations = [
    {
      skill: "AWS",
      courses: [
        { title: "AWS Fundamentals", provider: "Cloud Academy", duration: "8 hours" },
        { title: "AWS Certified Developer", provider: "A Cloud Guru", duration: "25 hours" }
      ]
    },
    {
      skill: "Docker",
      courses: [
        { title: "Docker for Developers", provider: "Udemy", duration: "6 hours" },
        { title: "Docker & Kubernetes", provider: "Pluralsight", duration: "12 hours" }
      ]
    },
    {
      skill: "TypeScript",
      courses: [
        { title: "TypeScript Essentials", provider: "Frontend Masters", duration: "5 hours" },
        { title: "Advanced TypeScript", provider: "Egghead.io", duration: "3 hours" }
      ]
    }
  ];
  
  // Industry trends data
  const industryTrendsData = [
    { name: "Frontend", previous: 80, current: 85, growth: 5 },
    { name: "Backend", previous: 75, current: 82, growth: 7 },
    { name: "DevOps", previous: 70, current: 85, growth: 15 },
    { name: "Mobile", previous: 65, current: 75, growth: 10 },
    { name: "Data Science", previous: 85, current: 95, growth: 10 },
    { name: "Cloud", previous: 80, current: 90, growth: 10 },
    { name: "Security", previous: 70, current: 85, growth: 15 }
  ];
  
  // Top in-demand skills data
  const inDemandSkillsData = [
    { name: "React", demand: 95 },
    { name: "AWS", demand: 90 },
    { name: "Python", demand: 88 },
    { name: "TypeScript", demand: 85 },
    { name: "Docker", demand: 82 },
    { name: "Node.js", demand: 80 },
    { name: "GraphQL", demand: 75 }
  ];
  
  // Format data for radar chart
  const formatRadarData = (skills: SkillAssessment["skills"]) => {
    return skills.map(skill => ({
      subject: skill.name,
      A: skill.proficiency,
      B: skill.industry,
      fullMark: 100
    }));
  };
  
  // Get color for skill gap
  const getGapColor = (gap: number) => {
    if (gap <= -5) return "text-green-600";
    if (gap >= 15) return "text-red-600";
    return "text-yellow-600";
  };
  
  // Get icon for skill gap
  const getGapIcon = (gap: number) => {
    if (gap <= -5) return "ri-arrow-up-line";
    if (gap >= 15) return "ri-arrow-down-line";
    return "ri-arrow-right-line";
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Skill Analysis</h1>
        <p className="text-gray-600">Analyze your skills and identify improvement opportunities</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="w-full bg-white border border-gray-200 p-1 shadow-sm">
          <TabsTrigger value="overview" className="flex-1">Skills Overview</TabsTrigger>
          <TabsTrigger value="gap" className="flex-1">Skill Gap Analysis</TabsTrigger>
          <TabsTrigger value="learning" className="flex-1">Learning Recommendations</TabsTrigger>
          <TabsTrigger value="trends" className="flex-1">Industry Trends</TabsTrigger>
        </TabsList>
        
        {/* Skills Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Skill Proficiency</CardTitle>
              <CardDescription>
                Overview of your skills across different categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex w-full mb-6">
                <Input 
                  placeholder="Search skills..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-grow"
                />
              </div>
              
              <div className="space-y-8">
                {filteredSkills.map((category, index) => (
                  <div key={index}>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">{category.category}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={formatRadarData(category.skills)}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="subject" />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} />
                            <Radar name="Your Proficiency" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                            <Radar name="Industry Standard" dataKey="B" stroke="#10b981" fill="#10b981" fillOpacity={0.15} />
                            <Legend />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                      
                      <div className="space-y-4">
                        {category.skills.map((skill, skillIndex) => (
                          <div key={skillIndex}>
                            <div className="flex justify-between items-center mb-1">
                              <div className="flex items-center">
                                <span className="font-medium text-gray-900">{skill.name}</span>
                                <div className={`ml-2 flex items-center ${getGapColor(skill.gap)}`}>
                                  <i className={getGapIcon(skill.gap)}></i>
                                  <span className="text-xs">{Math.abs(skill.gap)}%</span>
                                </div>
                              </div>
                              <span className="text-sm text-gray-600">{skill.proficiency}%</span>
                            </div>
                            <div className="relative w-full h-2 bg-gray-200 rounded">
                              <div 
                                className="absolute top-0 left-0 h-2 bg-primary-600 rounded"
                                style={{ width: `${skill.proficiency}%` }}
                              ></div>
                              <div 
                                className="absolute top-0 left-0 h-2 border-r-2 border-green-500"
                                style={{ left: `${skill.industry}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredSkills.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No skills matching your search criteria.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Skill Gap Analysis Tab */}
        <TabsContent value="gap" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Skill Gap Analysis</CardTitle>
              <CardDescription>
                Identify gaps between your skills and industry requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {skillAssessments.map((category, index) => (
                  <div key={index}>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">{category.category}</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={category.skills.map(skill => ({
                              name: skill.name,
                              Proficiency: skill.proficiency,
                              Industry: skill.industry,
                              Gap: Math.abs(skill.gap)
                            }))}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Proficiency" fill="#3b82f6" />
                            <Bar dataKey="Industry" fill="#10b981" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      
                      <div>
                        <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                          <h4 className="font-medium text-yellow-800 mb-2">Gap Analysis</h4>
                          <p className="text-sm text-yellow-700">
                            Your skills are compared to industry benchmarks to identify areas for improvement.
                            Positive gaps indicate your skills exceed industry standards, while negative gaps
                            show areas where improvement is needed.
                          </p>
                        </div>
                        
                        <div className="space-y-3">
                          {category.skills
                            .sort((a, b) => a.gap - b.gap)
                            .map((skill, skillIndex) => (
                              <div key={skillIndex} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                                <div>
                                  <h4 className="font-medium text-gray-900">{skill.name}</h4>
                                  <div className="flex items-center mt-1">
                                    <span className="text-xs text-gray-600 mr-3">
                                      You: {skill.proficiency}%
                                    </span>
                                    <span className="text-xs text-gray-600">
                                      Industry: {skill.industry}%
                                    </span>
                                  </div>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  skill.gap <= -5 ? "bg-green-100 text-green-800" :
                                  skill.gap >= 15 ? "bg-red-100 text-red-800" :
                                  "bg-yellow-100 text-yellow-800"
                                }`}>
                                  {skill.gap > 0 ? `-${skill.gap}%` : `+${Math.abs(skill.gap)}%`}
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Learning Recommendations Tab */}
        <TabsContent value="learning" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personalized Learning Recommendations</CardTitle>
              <CardDescription>
                Curated courses and resources based on your skill gaps
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {skillAssessments.flatMap(category => 
                    category.skills
                      .filter(skill => skill.gap > 10)
                      .sort((a, b) => b.gap - a.gap)
                      .slice(0, 3)
                      .map((skill, index) => (
                        <Card key={index} className="border border-gray-200">
                          <CardContent className="p-4">
                            <div className="w-full flex justify-between items-center mb-3">
                              <Badge className="bg-red-100 text-red-800">Priority</Badge>
                              <span className="text-sm text-red-600">Gap: {skill.gap}%</span>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-1">{skill.name}</h3>
                            <div className="flex justify-between text-xs text-gray-600 mb-1">
                              <span>Current: {skill.proficiency}%</span>
                              <span>Target: {skill.industry}%</span>
                            </div>
                            <Progress value={skill.proficiency} className="h-2 mb-4" />
                            <Button size="sm" className="w-full">View Learning Path</Button>
                          </CardContent>
                        </Card>
                      ))
                  )}
                </div>
                
                <div className="space-y-4">
                  {learningRecommendations.map((rec, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{rec.skill} Learning Path</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {rec.courses.map((course, courseIndex) => (
                            <div key={courseIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div>
                                <h4 className="font-medium text-gray-900">{course.title}</h4>
                                <div className="flex items-center mt-1">
                                  <span className="text-xs text-gray-600 mr-3">
                                    {course.provider}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {course.duration}
                                  </span>
                                </div>
                              </div>
                              <Button size="sm" variant="outline">Start Course</Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Industry Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Industry Trends & Demand</CardTitle>
              <CardDescription>
                Stay updated with the latest tech industry trends and in-demand skills
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Field Growth Trends</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={industryTrendsData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="previous" name="Previous Year" fill="#94a3b8" />
                      <Bar dataKey="current" name="Current Year" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Top In-Demand Skills</h3>
                  <div className="space-y-3">
                    {inDemandSkillsData.map((skill, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-gray-900">{skill.name}</span>
                          <span className="text-sm text-gray-600">{skill.demand}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${skill.demand}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Fastest Growing Fields</h3>
                  <div className="space-y-3">
                    {industryTrendsData
                      .sort((a, b) => b.growth - a.growth)
                      .map((field, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                          <div>
                            <h4 className="font-medium text-gray-900">{field.name}</h4>
                            <div className="flex items-center mt-1">
                              <span className="text-xs text-gray-600">
                                Growth: +{field.growth}%
                              </span>
                            </div>
                          </div>
                          <div className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {field.growth > 10 ? "High Growth" : "Steady Growth"}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <h3 className="text-lg font-medium text-blue-800 mb-2">Industry Insights</h3>
                  <p className="text-sm text-blue-700 mb-4">
                    Based on your current skills and industry trends, we've identified these key insights:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <i className="ri-information-line text-blue-600 mr-2 mt-1"></i>
                      <span className="text-sm text-blue-700">
                        Cloud skills like AWS show the highest growth and demand in the market, with a 35% gap in your current proficiency.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-information-line text-blue-600 mr-2 mt-1"></i>
                      <span className="text-sm text-blue-700">
                        Your React skills are strong, but adding TypeScript would significantly increase your marketability.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-information-line text-blue-600 mr-2 mt-1"></i>
                      <span className="text-sm text-blue-700">
                        DevOps skills like Docker show high growth (15%) and would complement your current technical skillset.
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}