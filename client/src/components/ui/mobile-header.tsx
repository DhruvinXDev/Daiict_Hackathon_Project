import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

const navigationItems = [
  { name: "Dashboard", path: "/", icon: "ri-dashboard-line" },
  { name: "Resume Builder", path: "/resume-builder", icon: "ri-file-list-line" },
  { name: "Job Market", path: "/job-market", icon: "ri-line-chart-line" },
  { name: "Networking", path: "/networking", icon: "ri-team-line" },
  { name: "Learning", path: "/learning", icon: "ri-book-open-line" },
  { name: "Mentors", path: "/mentors", icon: "ri-user-star-line" },
  { name: "Webinars", path: "/webinars", icon: "ri-video-chat-line" },
  { name: "Career Roadmap", path: "/career-roadmap", icon: "ri-road-map-line" },
  { name: "Interview Prep", path: "/interview-prep", icon: "ri-question-answer-line" },
  { name: "Skill Analysis", path: "/skill-analysis", icon: "ri-bar-chart-grouped-line" },
];

export default function MobileHeader() {
  const [location] = useLocation();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  
  return (
    <div className="lg:hidden fixed top-0 inset-x-0 z-30 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button className="text-gray-500 focus:outline-none">
              <i className="ri-menu-line text-2xl"></i>
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-center h-16 border-b border-gray-200 px-4">
                <div className="flex items-center">
                  <div className="bg-primary-600 text-white p-2 rounded-lg">
                    <i className="ri-rocket-2-fill text-xl"></i>
                  </div>
                  <h1 className="ml-2 text-xl font-semibold font-accent">CareerVerse</h1>
                </div>
              </div>
              <div className="overflow-y-auto py-4 px-3 flex-grow">
                <ul className="space-y-2">
                  {navigationItems.map((item) => (
                    <li key={item.path}>
                      <Link href={item.path}>
                        <a 
                          className={cn(
                            "flex items-center p-2 text-base font-normal text-gray-900 rounded-lg",
                            location === item.path 
                              ? "bg-gray-100" 
                              : "hover:bg-gray-100"
                          )}
                          onClick={() => setOpen(false)}
                        >
                          <i 
                            className={cn(
                              item.icon, 
                              "text-xl",
                              location === item.path 
                                ? "text-primary-600"
                                : "text-gray-500"
                            )}
                          ></i>
                          <span className="ml-3">{item.name}</span>
                        </a>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-primary-700 font-medium">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">{user?.userType}</p>
                  </div>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        
        <div className="flex items-center">
          <div className="bg-primary-600 text-white p-1.5 rounded-lg">
            <i className="ri-rocket-2-fill text-lg"></i>
          </div>
          <h1 className="ml-2 text-lg font-semibold font-accent">CareerVerse</h1>
        </div>
        
        <button className="text-gray-500 focus:outline-none relative">
          <i className="ri-notification-3-line text-xl"></i>
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
        </button>
      </div>
    </div>
  );
}
