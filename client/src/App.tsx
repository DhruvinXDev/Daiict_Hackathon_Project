import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Sidebar from "@/components/ui/sidebar";
import MobileHeader from "@/components/ui/mobile-header";
import MobileNavbar from "@/components/ui/mobile-navbar";
import Dashboard from "@/pages/dashboard";
import ResumeBuilder from "@/pages/resume-builder";
import JobMarket from "@/pages/job-market";
import Networking from "@/pages/networking";
import Learning from "@/pages/learning";
import Mentors from "@/pages/mentors";
import Webinars from "@/pages/webinars";
import CareerRoadmap from "@/pages/career-roadmap";
import InterviewPrep from "@/pages/interview-prep";
import SkillAnalysis from "@/pages/skill-analysis";
import AuthModal from "@/components/auth/auth-modal";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

function Router() {
  const { isAuthenticated, checkAuth } = useAuth();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  
  if (!isAuthenticated) {
    return <AuthModal />;
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {isMobile && <MobileHeader />}
      <Sidebar />
      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/resume-builder" component={ResumeBuilder} />
          <Route path="/job-market" component={JobMarket} />
          <Route path="/networking" component={Networking} />
          <Route path="/learning" component={Learning} />
          <Route path="/mentors" component={Mentors} />
          <Route path="/webinars" component={Webinars} />
          <Route path="/career-roadmap" component={CareerRoadmap} />
          <Route path="/interview-prep" component={InterviewPrep} />
          <Route path="/skill-analysis" component={SkillAnalysis} />
          <Route component={NotFound} />
        </Switch>
      </main>
      {isMobile && <MobileNavbar />}
    </div>
  );
}

function App() {
  return (
    <>
      <Router />
      <Toaster />
    </>
  );
}

export default App;
