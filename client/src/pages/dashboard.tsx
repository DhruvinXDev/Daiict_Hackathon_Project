import { useAuth } from "@/hooks/use-auth";
import ProfileSummary from "@/components/dashboard/profile-summary";
import ProgressCard from "@/components/dashboard/progress-card";
import CareerRoadmap from "@/components/dashboard/career-roadmap";
import JobMarketInsights from "@/components/dashboard/job-market-insights";
import UpcomingWebinars from "@/components/dashboard/upcoming-webinars";
import RecommendedMentors from "@/components/dashboard/recommended-mentors";
import ResumeSection from "@/components/dashboard/resume-section";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { user } = useAuth();
  
  return (
    <div className="px-4 py-6 lg:px-8 lg:py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.firstName || "User"}!</h1>
          <p className="text-gray-600 mt-1">Your career journey is 45% complete</p>
        </div>
        <div className="flex space-x-3 mt-4 md:mt-0">
          <Button className="flex items-center">
            <i className="ri-add-line mr-1"></i> Add Skills
          </Button>
          <div className="relative">
            <Button variant="outline" size="icon" className="p-2">
              <i className="ri-notification-3-line text-xl"></i>
            </Button>
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
          </div>
        </div>
      </div>
      
      {/* Profile Section */}
      <ProfileSummary />
      
      {/* Progress Tracking */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Progress</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <ProgressCard 
            title="Profile Completion" 
            value={45}
            icon="ri-user-line"
            iconColor="text-primary-600"
            bgColor="bg-primary-100"
            message="Complete your education details to increase your score"
          />
          <ProgressCard 
            title="Resume Score" 
            value={72}
            icon="ri-file-list-line"
            iconColor="text-secondary-600"
            bgColor="bg-secondary-100"
            message="Add more relevant skills to improve your resume"
          />
          <ProgressCard 
            title="Interview Readiness" 
            value={28}
            icon="ri-question-answer-line"
            iconColor="text-accent-600"
            bgColor="bg-accent-100"
            message="Take practice interviews to improve your score"
          />
        </div>
      </div>
      
      {/* Career Roadmap */}
      <CareerRoadmap />
      
      {/* Two Column Layout for Remaining Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <JobMarketInsights />
        <UpcomingWebinars />
        <RecommendedMentors />
        <ResumeSection />
      </div>
    </div>
  );
}
