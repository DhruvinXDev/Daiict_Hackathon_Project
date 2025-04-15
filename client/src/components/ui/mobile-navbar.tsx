import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

const mobileNavItems = [
  { name: "Dashboard", path: "/", icon: "ri-dashboard-line" },
  { name: "Resume", path: "/resume-builder", icon: "ri-file-list-line" },
  { name: "Mentors", path: "/mentors", icon: "ri-user-star-line" },
  { name: "Roadmap", path: "/career-roadmap", icon: "ri-road-map-line" },
  { name: "Settings", path: "/settings", icon: "ri-settings-3-line" },
];

export default function MobileNavbar() {
  const [location] = useLocation();
  
  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-gray-200">
      <div className="flex items-center justify-around h-16">
        {mobileNavItems.map((item) => (
          <Link key={item.path} href={item.path}>
            <a 
              className={cn(
                "flex flex-col items-center justify-center w-full",
                location === item.path 
                  ? "text-primary-600" 
                  : "text-gray-500"
              )}
            >
              <i className={`${item.icon} text-xl`}></i>
              <span className="text-xs mt-1">{item.name}</span>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}
