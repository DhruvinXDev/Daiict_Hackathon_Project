import { Switch, Route, Redirect } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Sidebar from "@/components/ui/sidebar";
import MobileHeader from "@/components/ui/mobile-header";
import MobileNavbar from "@/components/ui/mobile-navbar";
import Dashboard from "@/pages/dashboard";
import HomePage from "@/pages/home";
import ResumeBuilder from "@/pages/resume-builder";
import JobMarket from "@/pages/job-market";
import Networking from "@/pages/networking";
import Learning from "@/pages/learning";
import Mentors from "@/pages/mentors";
import Webinars from "@/pages/webinars";
import CareerRoadmap from "./pages/career-roadmap";
import InterviewPrep from "./pages/interview-prep";
import SkillAnalysis from "./pages/skill-analysis";
import Settings from "./pages/settings";
import AuthPage from "./components/auth/auth-page";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { AuthProvider } from "@/contexts/auth-context";
import { ProfileProvider } from "@/contexts/profile-context";
import { ThemeProvider } from "@/contexts/theme-context";
import { ThemeToggle } from "@/components/ui/theme-toggle";

// Protected route component
function ProtectedRouteComponent({ component: Component, ...rest }: { component: React.ComponentType, path?: string }) {
  const { user, isLoading } = useAuth();
  const isMobile = useIsMobile();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/auth" />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {isMobile && <MobileHeader />}
      <Sidebar />
      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0">
        <Component />
      </main>
      {isMobile && <MobileNavbar />}
      <ThemeToggle />
    </div>
  );
}

// Custom route component for protected routes
function ProtectedRoute({ path, component: Component }: { path: string, component: React.ComponentType }) {
  return (
    <Route path={path}>
      <ProtectedRouteComponent component={Component} />
    </Route>
  );
}

// Only the router content needs authentication context
function AuthenticatedRoutes() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <Switch>
          <Route path="/home" component={HomePage} />
          <Route path="/auth" component={AuthPage} />
          <ProtectedRoute path="/" component={Dashboard} />
          <ProtectedRoute path="/resume-builder" component={ResumeBuilder} />
          <ProtectedRoute path="/job-market" component={JobMarket} />
          <ProtectedRoute path="/networking" component={Networking} />
          <ProtectedRoute path="/learning" component={Learning} />
          <ProtectedRoute path="/mentors" component={Mentors} />
          <ProtectedRoute path="/webinars" component={Webinars} />
          <ProtectedRoute path="/career-roadmap" component={CareerRoadmap} />
          <ProtectedRoute path="/interview-prep" component={InterviewPrep} />
          <ProtectedRoute path="/skill-analysis" component={SkillAnalysis} />
          <ProtectedRoute path="/settings" component={Settings} />
          <Route component={NotFound} />
        </Switch>
      </ProfileProvider>
    </AuthProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthenticatedRoutes />
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
