import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface Mentor {
  id: number;
  userId: number;
  company: string;
  position: string;
  specialization: string[];
  availability: Record<string, any>;
  verified: boolean;
  user?: {
    firstName: string;
    lastName: string;
  };
}

export default function RecommendedMentors() {
  // This would typically fetch mentors from the API
  // For now we'll use a static list
  const mockMentors = [
    {
      id: 1,
      userId: 1,
      company: "Google",
      position: "Senior Software Engineer",
      specialization: ["React", "Node.js", "System Design"],
      matchPercentage: 98,
      verified: true,
      user: {
        firstName: "David",
        lastName: "Chen"
      }
    },
    {
      id: 2,
      userId: 2,
      company: "Netflix",
      position: "Frontend Developer",
      specialization: ["React", "UI/UX", "CSS"],
      matchPercentage: 92,
      verified: true,
      user: {
        firstName: "Amanda",
        lastName: "Park"
      }
    }
  ];
  
  // This would be the actual implementation
  // const { data: mentors, isLoading, error } = useQuery<Mentor[]>({
  //   queryKey: ["/api/mentors"],
  // });
  
  // Simulating loading state for demonstration
  const isLoading = false;
  const error = null;
  const mentors = mockMentors;
  
  if (isLoading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-28" />
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <Skeleton className="h-5 w-56" />
          </div>
          <div className="divide-y divide-gray-200">
            <div className="p-4">
              <div className="flex items-start">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-32 mb-1" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-3 w-48 mb-2" />
                  <div className="flex flex-wrap gap-1">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-start">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-32 mb-1" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-3 w-48 mb-2" />
                  <div className="flex flex-wrap gap-1">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recommended Mentors</h2>
          <Link href="/mentors">
            <Button variant="link" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              Find Mentors
            </Button>
          </Link>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <p className="text-gray-500">Failed to load mentor recommendations.</p>
          <Button variant="outline" className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Recommended Mentors</h2>
        <Link href="/mentors">
          <Button variant="link" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            Find Mentors
          </Button>
        </Link>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-medium text-gray-800">Based on your career goals</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {mentors.map((mentor) => (
            <div key={mentor.id} className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary-700">
                      {mentor.user?.firstName?.[0]}{mentor.user?.lastName?.[0]}
                    </span>
                  </div>
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900">
                      {mentor.user?.firstName} {mentor.user?.lastName}
                    </h4>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      {mentor.matchPercentage}% Match
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">{mentor.position} at {mentor.company}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {mentor.specialization.map((skill) => (
                      <span key={skill} className="px-2 py-0.5 bg-gray-100 text-gray-800 text-xs rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-3 flex justify-end space-x-2">
                <Button variant="outline" size="sm" className="text-xs">
                  View Profile
                </Button>
                <Button size="sm" className="text-xs">
                  Connect
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
