import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function CareerRoadmap() {
  const { user } = useAuth();
  
  // Placeholder roadmap data
  const roadmapData = {
    currentMilestone: 2,
    milestones: [
      {
        id: 1,
        title: "Profile Setup",
        description: "Complete your profile with education, skills, and experience",
        status: "completed" as const,
        progress: 100,
      },
      {
        id: 2,
        title: "Resume Creation",
        description: "Build and optimize your professional resume",
        status: "in-progress" as const,
        progress: 65,
      },
      {
        id: 3,
        title: "Skill Assessment",
        description: "Evaluate your technical and soft skills",
        status: "pending" as const,
        progress: 0,
      },
      {
        id: 4,
        title: "Learning Path",
        description: "Complete recommended courses for your career goals",
        status: "locked" as const,
        progress: 0,
      },
      {
        id: 5,
        title: "Interview Preparation",
        description: "Practice with mock interviews and feedback",
        status: "locked" as const,
        progress: 0,
      },
    ],
  };

  // Get status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Completed</Badge>;
      case "in-progress":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">In Progress</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      case "locked":
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Locked</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Career Roadmap</h1>
        <p className="text-gray-600">Your personalized path to career growth</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Your Progress</CardTitle>
          <CardDescription>
            You've completed {roadmapData.milestones.filter(m => m.status === "completed").length} of {roadmapData.milestones.length} milestones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
            <div 
              className="bg-primary-600 h-4 rounded-full"
              style={{ width: `${(roadmapData.currentMilestone - 1 + roadmapData.milestones[roadmapData.currentMilestone - 1].progress / 100) / roadmapData.milestones.length * 100}%` }} 
            ></div>
          </div>
          
          <div className="space-y-6">
            {roadmapData.milestones.map((milestone, index) => (
              <div key={milestone.id} className="flex">
                <div className="mr-4 flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    milestone.status === "completed" ? "bg-green-500 text-white" :
                    milestone.status === "in-progress" ? "bg-blue-500 text-white" :
                    "bg-gray-200 text-gray-600"
                  }`}>
                    {milestone.status === "completed" ? (
                      <i className="ri-check-line"></i>
                    ) : (
                      index + 1
                    )}
                  </div>
                  {index < roadmapData.milestones.length - 1 && (
                    <div className={`w-0.5 h-16 ${
                      milestone.status === "completed" ? "bg-green-500" :
                      milestone.status === "in-progress" ? "bg-blue-300" :
                      "bg-gray-200"
                    }`}></div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                    {getStatusBadge(milestone.status)}
                  </div>
                  
                  {milestone.status === "in-progress" && (
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{milestone.progress}%</span>
                      </div>
                      <Progress value={milestone.progress} className="h-2" />
                      <div className="mt-3">
                        <Button size="sm">Continue</Button>
                      </div>
                    </div>
                  )}
                  
                  {milestone.status === "pending" && (
                    <div className="mt-2">
                      <Button size="sm">Start</Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recommended Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="bg-primary-100 p-2 rounded-full mr-3 text-primary-600">
                  <i className="ri-file-list-line"></i>
                </div>
                <div>
                  <h4 className="font-medium">Complete Your Resume</h4>
                  <p className="text-sm text-gray-600">Add your relevant experience and skills</p>
                  <Button size="sm" variant="link" className="p-0 h-auto mt-1">Go to Resume Builder</Button>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-primary-100 p-2 rounded-full mr-3 text-primary-600">
                  <i className="ri-bar-chart-grouped-line"></i>
                </div>
                <div>
                  <h4 className="font-medium">Take Skill Assessment</h4>
                  <p className="text-sm text-gray-600">Evaluate your current skills and identify gaps</p>
                  <Button size="sm" variant="link" className="p-0 h-auto mt-1">Start Assessment</Button>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Career Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Short-term Goal</h4>
                <p className="text-gray-600">Become a Junior Frontend Developer</p>
                <div className="flex justify-between text-sm text-gray-600 mt-2 mb-1">
                  <span>Progress</span>
                  <span>40%</span>
                </div>
                <Progress value={40} className="h-2" />
              </div>
              
              <div>
                <h4 className="font-medium">Mid-term Goal</h4>
                <p className="text-gray-600">Advance to Senior Frontend Developer</p>
                <div className="flex justify-between text-sm text-gray-600 mt-2 mb-1">
                  <span>Progress</span>
                  <span>15%</span>
                </div>
                <Progress value={15} className="h-2" />
              </div>
              
              <div>
                <h4 className="font-medium">Long-term Goal</h4>
                <p className="text-gray-600">Become a Technical Lead</p>
                <div className="flex justify-between text-sm text-gray-600 mt-2 mb-1">
                  <span>Progress</span>
                  <span>5%</span>
                </div>
                <Progress value={5} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}