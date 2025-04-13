import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest } from "@/lib/queryClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Speaker {
  name: string;
  title: string;
}

interface Webinar {
  id: number;
  title: string;
  description: string;
  speakerName: string;
  speakerTitle: string;
  date: string;
  registeredUsers: number[];
}

export default function UpcomingWebinars() {
  const queryClient = useQueryClient();
  
  const { data: webinars, isLoading, error } = useQuery<Webinar[]>({
    queryKey: ["/api/webinars"],
  });
  
  const registerMutation = useMutation({
    mutationFn: async (webinarId: number) => {
      const response = await apiRequest("POST", `/api/webinars/${webinarId}/register`, {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/webinars"] });
      toast({
        title: "Success",
        description: "You've been registered for the webinar",
      });
    },
    onError: () => {
      toast({
        title: "Registration failed",
        description: "Could not register for the webinar",
        variant: "destructive"
      });
    }
  });
  
  const handleRegister = (webinarId: number) => {
    registerMutation.mutate(webinarId);
  };
  
  const formatWebinarDate = (dateString: string) => {
    const date = new Date(dateString);
    const isToday = new Date().toDateString() === date.toDateString();
    const isTomorrow = new Date(Date.now() + 86400000).toDateString() === date.toDateString();
    
    if (isToday) {
      return `Today, ${format(date, "h:mm a")}`;
    } else if (isTomorrow) {
      return `Tomorrow, ${format(date, "h:mm a")}`;
    } else {
      return format(date, "E, MMM d, h:mm a");
    }
  };
  
  if (isLoading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <Skeleton className="h-5 w-40 mb-2" />
          </div>
          <div className="divide-y divide-gray-200">
            <div className="p-4">
              <div className="flex items-start">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="ml-3 flex-1">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2 mb-1" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-start">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="ml-3 flex-1">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2 mb-1" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !webinars) {
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Upcoming Webinars</h2>
          <Link href="/webinars">
            <Button variant="link" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View All
            </Button>
          </Link>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <p className="text-gray-500">Failed to load webinars.</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/webinars"] })}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Upcoming Webinars</h2>
        <Link href="/webinars">
          <Button variant="link" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View All
          </Button>
        </Link>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-800">Recommended For You</h3>
            <div className="flex">
              <button className="text-gray-400 hover:text-gray-500">
                <i className="ri-arrow-left-s-line text-xl"></i>
              </button>
              <button className="text-gray-900 hover:text-gray-700 ml-2">
                <i className="ri-arrow-right-s-line text-xl"></i>
              </button>
            </div>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {webinars.slice(0, 2).map((webinar) => (
            <div key={webinar.id} className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary-700">
                      {webinar.speakerName.charAt(0)}
                    </span>
                  </div>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-gray-900">{webinar.title}</h4>
                  <div className="mt-1 flex items-center">
                    <i className="ri-user-line text-gray-400 text-sm"></i>
                    <span className="ml-1 text-xs text-gray-500">
                      {webinar.speakerName} • {webinar.speakerTitle}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center">
                    <i className="ri-time-line text-gray-400 text-sm"></i>
                    <span className="ml-1 text-xs text-gray-500">
                      {formatWebinarDate(webinar.date)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex justify-end">
                <Button
                  size="sm"
                  onClick={() => handleRegister(webinar.id)}
                  disabled={registerMutation.isPending}
                >
                  Register
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-gray-200">
          <Link href="/webinars">
            <Button 
              variant="ghost" 
              className="w-full text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              Browse All Webinars
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
