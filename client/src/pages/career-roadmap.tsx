import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/hooks/use-profile";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle, Lock, ArrowRight } from "lucide-react";

export default function CareerRoadmap() {
  const { user } = useAuth();
  const { profile } = useProfile();
  
  // Example roadmap data
  // In a real app, this would come from an API
  const roadmapData = {
    currentMilestone: 1,
    milestones: [
      {
        id: 1,
        title: "Complete Your Profile",
        description: "Add your educational background, skills, and experience to your profile.",
        status: "completed",
        steps: [
          { id: 1, name: "Add education details", completed: true },
          { id: 2, name: "Add skills", completed: true },
          { id: 3, name: "Add work experience", completed: true }
        ]
      },
      {
        id: 2,
        title: "Build Your Resume",
        description: "Create a professional resume using our AI-powered resume builder.",
        status: "in-progress",
        steps: [
          { id: 1, name: "Create a resume", completed: false },
          { id: 2, name: "Get AI feedback", completed: false },
          { id: 3, name: "Optimize for ATS", completed: false }
        ]
      },
      {
        id: 3,
        title: "Skills Assessment",
        description: "Identify skill gaps and areas for improvement.",
        status: "locked",
        steps: [
          { id: 1, name: "Take skills assessment", completed: false },
          { id: 2, name: "Review results", completed: false },
          { id: 3, name: "Create learning plan", completed: false }
        ]
      },
      {
        id: 4,
        title: "Prepare for Interviews",
        description: "Practice with AI-powered mock interviews.",
        status: "locked",
        steps: [
          { id: 1, name: "Complete practice interviews", completed: false },
          { id: 2, name: "Review feedback", completed: false },
          { id: 3, name: "Improve responses", completed: false }
        ]
      },
      {
        id: 5,
        title: "Job Search Strategy",
        description: "Develop a strategic approach to your job search.",
        status: "locked",
        steps: [
          { id: 1, name: "Define target companies", completed: false },
          { id: 2, name: "Set up job alerts", completed: false },
          { id: 3, name: "Track applications", completed: false }
        ]
      }
    ]
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Career Roadmap</h1>
        <p className="text-muted-foreground">Your personalized career development journey</p>
      </div>

      <div className="grid gap-6">
        {roadmapData.milestones.map((milestone, index) => {
          const isCompleted = milestone.status === "completed";
          const isInProgress = milestone.status === "in-progress";
          const isLocked = milestone.status === "locked";

          return (
            <Card key={milestone.id} className={isLocked ? "opacity-70" : ""}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  {isCompleted ? (
                    <CheckCircle className="w-6 h-6 text-primary" />
                  ) : isInProgress ? (
                    <Circle className="w-6 h-6 text-primary" />
                  ) : (
                    <Lock className="w-6 h-6 text-muted-foreground" />
                  )}
                  <div>
                    <CardTitle className="text-xl">Milestone {index + 1}: {milestone.title}</CardTitle>
                    <CardDescription className="text-base">{milestone.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    {milestone.steps.map((step) => (
                      <div key={step.id} className="flex items-center gap-2">
                        {step.completed ? (
                          <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        )}
                        <span className={step.completed ? "" : "text-muted-foreground"}>
                          {step.name}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-end">
                    {isCompleted ? (
                      <Button variant="outline" size="sm" disabled>
                        Completed
                      </Button>
                    ) : isInProgress ? (
                      <Button size="sm">
                        Continue
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" disabled={isLocked}>
                        {isLocked ? "Locked" : "Start"}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}