import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type Milestone = {
  id: number;
  title: string;
  description: string;
  status: "completed" | "in-progress" | "pending" | "locked";
};

interface RoadmapData {
  id: number;
  userId: number;
  milestones: Milestone[];
  currentMilestone: number;
}

export default function CareerRoadmap() {
  const { data: roadmap, isLoading, error } = useQuery<RoadmapData>({
    queryKey: ["/api/roadmap"],
  });
  
  const getMilestoneIcon = (status: string) => {
    switch (status) {
      case "completed":
        return "ri-checkbox-circle-line";
      case "in-progress":
        return "ri-time-line";
      case "pending":
      case "locked":
      default:
        return "ri-lock-line";
    }
  };
  
  const getMilestoneStatusClass = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "pending":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "locked":
      default:
        return "bg-muted text-muted-foreground dark:bg-slate-700 dark:text-slate-300";
    }
  };
  
  const getMilestoneStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "in-progress":
        return "In Progress";
      case "pending":
        return "Pending";
      case "locked":
      default:
        return "Locked";
    }
  };
  
  const getMilestoneBgClass = (status: string) => {
    switch (status) {
      case "completed":
      case "in-progress":
      case "pending":
        return "bg-primary/5 border-primary/20 dark:bg-primary/10 dark:border-primary/40";
      case "locked":
      default:
        return "bg-muted/50 border-border dark:bg-slate-800/50 dark:border-slate-600";
    }
  };
  
  const getMilestoneIconBgClass = (status: string) => {
    switch (status) {
      case "completed":
      case "in-progress":
        return "bg-primary";
      case "pending":
      case "locked":
      default:
        return "bg-muted-foreground dark:bg-slate-500";
    }
  };
  
  if (isLoading) {
    return (
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="bg-card rounded-lg shadow-sm border border-border p-6">
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }
  
  if (error || !roadmap) {
    return (
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-foreground">Career Roadmap</h2>
          <Link href="/career-roadmap">
            <Button variant="link" className="text-primary hover:text-primary/80 text-sm font-medium">
              View Full Roadmap
            </Button>
          </Link>
        </div>
        <div className="bg-card rounded-lg shadow-sm border border-border p-6 text-center py-12">
          <p className="text-muted-foreground">Could not load roadmap information.</p>
          <Button 
            variant="outline" 
            className="mt-4 border-border text-foreground hover:bg-muted"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }
  
  // Default milestones if none are provided
  const milestones = roadmap.milestones.length > 0 ? roadmap.milestones : [
    {
      id: 1,
      title: "Complete Profile",
      description: "Add education, skills, and experience to your profile",
      status: "in-progress"
    },
    {
      id: 2,
      title: "Build Professional Resume",
      description: "Create an ATS-friendly resume with our builder",
      status: "pending"
    },
    {
      id: 3,
      title: "Connect with Mentors",
      description: "Find industry professionals to guide your career journey",
      status: "locked"
    }
  ];
  
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-foreground">Career Roadmap</h2>
        <Link href="/career-roadmap">
          <Button variant="link" className="text-primary hover:text-primary/80 text-sm font-medium">
            View Full Roadmap
          </Button>
        </Link>
      </div>
      <div className="bg-card rounded-lg shadow-sm border border-border p-6 hover:shadow-md transition-shadow">
        <div className="relative">
          {/* Timeline bar */}
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-border dark:bg-slate-600"></div>
          
          {/* Timeline items */}
          {milestones.slice(0, 3).map((milestone, index) => (
            <div key={milestone.id} className="relative flex items-start mb-8">
              <div className="flex items-center justify-center w-16">
                <div className={`h-8 w-8 rounded-full border-4 border-card ${getMilestoneIconBgClass(milestone.status)} z-10 flex items-center justify-center text-white`}>
                  <i className={getMilestoneIcon(milestone.status)}></i>
                </div>
              </div>
              <div className="flex-1">
                <div className={`${getMilestoneBgClass(milestone.status)} p-4 rounded-lg border`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-primary dark:text-blue-400">{milestone.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground dark:text-slate-300">{milestone.description}</p>
                    </div>
                    <span className={`text-xs font-medium ${getMilestoneStatusClass(milestone.status)} px-2 py-1 rounded-full`}>
                      {getMilestoneStatusText(milestone.status)}
                    </span>
                  </div>
                  
                  {milestone.status === "in-progress" && (
                    <div className="mt-3">
                      <div className="flex items-center">
                        <div className="w-full bg-muted dark:bg-slate-700 rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: "60%" }}></div>
                        </div>
                        <span className="text-xs text-muted-foreground dark:text-slate-400 ml-2">60%</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
