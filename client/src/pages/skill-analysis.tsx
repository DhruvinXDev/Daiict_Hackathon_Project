import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, ArrowRight, ChevronRight, Target, Lightbulb, LineChart, CheckCircle } from "lucide-react";

export default function SkillAnalysis() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("skills");
  const [isAssessing, setIsAssessing] = useState(false);
  const [assessmentCompleted, setAssessmentCompleted] = useState(false);
  
  // Mock data - in a real app, this would come from an API
  const userSkills = [
    { name: "JavaScript", level: 85, category: "Technical" },
    { name: "React", level: 80, category: "Technical" },
    { name: "Node.js", level: 65, category: "Technical" },
    { name: "SQL", level: 70, category: "Technical" },
    { name: "Project Management", level: 60, category: "Soft Skill" },
    { name: "Communication", level: 75, category: "Soft Skill" },
    { name: "Problem Solving", level: 85, category: "Soft Skill" },
    { name: "UX Design", level: 40, category: "Design" },
  ];
  
  const skillGaps = [
    { 
      name: "TypeScript", 
      currentLevel: 30, 
      targetLevel: 70, 
      category: "Technical",
      relevance: "High",
      recommendations: [
        { title: "TypeScript Fundamentals", type: "Course", link: "#" },
        { title: "Advanced TypeScript", type: "Workshop", link: "#" },
        { title: "Converting JS to TS", type: "Tutorial", link: "#" }
      ]
    },
    { 
      name: "GraphQL", 
      currentLevel: 15, 
      targetLevel: 60, 
      category: "Technical",
      relevance: "Medium",
      recommendations: [
        { title: "GraphQL Basics", type: "Course", link: "#" },
        { title: "Building APIs with GraphQL", type: "Project", link: "#" }
      ]
    },
    { 
      name: "CI/CD", 
      currentLevel: 20, 
      targetLevel: 65, 
      category: "DevOps",
      relevance: "Medium",
      recommendations: [
        { title: "CI/CD Pipeline Fundamentals", type: "Course", link: "#" },
        { title: "GitHub Actions Workshop", type: "Workshop", link: "#" }
      ]
    },
    { 
      name: "UI Design", 
      currentLevel: 35, 
      targetLevel: 60, 
      category: "Design",
      relevance: "Low",
      recommendations: [
        { title: "UI Design Principles", type: "Course", link: "#" },
        { title: "Design for Developers", type: "Book", link: "#" }
      ]
    },
  ];
  
  const marketDemand = [
    { 
      role: "Frontend Developer", 
      matchPercentage: 80, 
      requiredSkills: [
        { name: "JavaScript", status: "Strong" },
        { name: "React", status: "Strong" },
        { name: "TypeScript", status: "Gap" },
        { name: "CSS/SASS", status: "Moderate" }
      ],
      jobCount: 1250,
      trending: "up",
      avgSalary: "$95,000"
    },
    { 
      role: "Full Stack Developer", 
      matchPercentage: 70, 
      requiredSkills: [
        { name: "JavaScript", status: "Strong" },
        { name: "React", status: "Strong" },
        { name: "Node.js", status: "Moderate" },
        { name: "SQL", status: "Moderate" },
        { name: "GraphQL", status: "Gap" }
      ],
      jobCount: 2300,
      trending: "up",
      avgSalary: "$110,000"
    },
    { 
      role: "UI/UX Developer", 
      matchPercentage: 55, 
      requiredSkills: [
        { name: "JavaScript", status: "Strong" },
        { name: "React", status: "Strong" },
        { name: "UI Design", status: "Gap" },
        { name: "UX Design", status: "Weak" }
      ],
      jobCount: 850,
      trending: "stable",
      avgSalary: "$90,000"
    },
    { 
      role: "DevOps Engineer", 
      matchPercentage: 40, 
      requiredSkills: [
        { name: "CI/CD", status: "Gap" },
        { name: "Cloud Services", status: "Gap" },
        { name: "Linux", status: "Moderate" },
        { name: "Problem Solving", status: "Strong" }
      ],
      jobCount: 1100,
      trending: "up",
      avgSalary: "$120,000"
    }
  ];

  const startAssessment = () => {
    setIsAssessing(true);
    
    // Simulate assessment process
    setTimeout(() => {
      setIsAssessing(false);
      setAssessmentCompleted(true);
    }, 3000);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Skill Analysis</h1>
        <p className="text-muted-foreground">Analyze your skills and identify areas for growth</p>
      </div>
      
      {!assessmentCompleted ? (
        <Card>
          <CardHeader>
            <CardTitle>Skill Assessment</CardTitle>
            <CardDescription>
              Take a comprehensive skill assessment to identify your strengths and areas for improvement
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center py-8">
              <div className="text-center space-y-4">
                <div className="text-6xl text-muted-foreground">🧠</div>
                <div className="text-xl font-medium">Ready to discover your skill profile?</div>
                <p className="text-muted-foreground max-w-md">
                  This assessment will evaluate your technical skills, soft skills, and career readiness. 
                  It takes approximately 15-20 minutes to complete.
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={startAssessment} disabled={isAssessing}>
              {isAssessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Assessing...
                </>
              ) : (
                <>
                  Start Assessment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="skills" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <span>Current Skills</span>
            </TabsTrigger>
            <TabsTrigger value="gaps" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span>Skill Gaps</span>
            </TabsTrigger>
            <TabsTrigger value="market" className="flex items-center gap-2">
              <LineChart className="h-4 w-4" />
              <span>Market Demand</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Current Skills Tab */}
          <TabsContent value="skills" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {userSkills.map((skill, index) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-xl">{skill.name}</CardTitle>
                      <Badge variant={
                        skill.category === "Technical" 
                          ? "default" 
                          : skill.category === "Soft Skill" 
                            ? "secondary" 
                            : "outline"
                      }>
                        {skill.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Proficiency</span>
                        <span className="font-medium">{skill.level}%</span>
                      </div>
                      <Progress value={skill.level} />
                      <div className="flex justify-between text-xs pt-1">
                        <span>Beginner</span>
                        <span>Intermediate</span>
                        <span>Expert</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          {/* Skill Gaps Tab */}
          <TabsContent value="gaps" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {skillGaps.map((gap, index) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-xl">{gap.name}</CardTitle>
                      <div className="flex gap-2">
                        <Badge variant={
                          gap.relevance === "High" 
                            ? "destructive" 
                            : gap.relevance === "Medium" 
                              ? "default" 
                              : "outline"
                        }>
                          {gap.relevance} Relevance
                        </Badge>
                        <Badge variant="outline">{gap.category}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">Current Level</span>
                          <span className="font-medium">{gap.currentLevel}%</span>
                        </div>
                        <Progress value={gap.currentLevel} className="bg-muted" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">Target Level</span>
                          <span className="font-medium">{gap.targetLevel}%</span>
                        </div>
                        <Progress value={gap.targetLevel} className="bg-muted/30" />
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2 flex items-center">
                        <Lightbulb className="h-4 w-4 mr-1 text-primary" />
                        <span>Recommended Resources</span>
                      </h4>
                      <ul className="space-y-1">
                        {gap.recommendations.map((rec, i) => (
                          <li key={i} className="text-sm">
                            <a href={rec.link} className="text-primary hover:underline flex items-center">
                              <span>{rec.title}</span>
                              <Badge variant="outline" className="ml-2 text-xs">{rec.type}</Badge>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          {/* Market Demand Tab */}
          <TabsContent value="market" className="space-y-4">
            <div className="grid gap-4">
              {marketDemand.map((role, index) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-xl">{role.role}</CardTitle>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Match:</span>
                        <Badge variant={
                          role.matchPercentage >= 70 
                            ? "default" 
                            : role.matchPercentage >= 50 
                              ? "secondary" 
                              : "outline"
                        }>
                          {role.matchPercentage}%
                        </Badge>
                      </div>
                    </div>
                    <CardDescription>
                      {role.jobCount.toLocaleString()} open positions • Avg. salary: {role.avgSalary} • 
                      Trending: <span className={role.trending === "up" ? "text-green-500" : "text-amber-500"}>
                        {role.trending === "up" ? "↑" : "→"}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <h4 className="text-sm font-medium mb-2">Required Skills</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {role.requiredSkills.map((skill, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <Badge variant={
                              skill.status === "Strong" 
                                ? "default" 
                                : skill.status === "Moderate" 
                                  ? "secondary" 
                                  : skill.status === "Weak" 
                                    ? "outline" 
                                    : "destructive"
                            } className="w-16 justify-center">
                              {skill.status}
                            </Badge>
                            <span className="text-sm">{skill.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full">
                          View Recommended Path
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Career Path: {role.role}</DialogTitle>
                          <DialogDescription>
                            Follow this personalized path to become a {role.role}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <h4 className="font-medium">1. Close Skill Gaps</h4>
                            <ul className="ml-6 list-disc text-sm space-y-1">
                              {role.requiredSkills
                                .filter(skill => skill.status === "Gap" || skill.status === "Weak")
                                .map((skill, i) => (
                                  <li key={i}>{skill.name}</li>
                                ))}
                            </ul>
                          </div>
                          <div className="space-y-2">
                            <h4 className="font-medium">2. Build Portfolio Projects</h4>
                            <ul className="ml-6 list-disc text-sm space-y-1">
                              <li>Create projects showcasing your {role.role} skills</li>
                              <li>Contribute to open-source projects related to this role</li>
                            </ul>
                          </div>
                          <div className="space-y-2">
                            <h4 className="font-medium">3. Apply for Entry Positions</h4>
                            <ul className="ml-6 list-disc text-sm space-y-1">
                              <li>Junior {role.role}</li>
                              <li>Associate {role.role}</li>
                            </ul>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button>Add to My Career Plan</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}