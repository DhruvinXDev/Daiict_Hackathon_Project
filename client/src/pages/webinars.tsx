import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, isAfter, isBefore, parseISO, addDays } from "date-fns";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

// Webinar interface from types
interface Webinar {
  id: number;
  title: string;
  description: string;
  speakerName: string;
  speakerTitle: string;
  date: string;
  registeredUsers: number[];
  category?: string;
  duration?: string;
  level?: string;
  tags?: string[];
  recording?: string;
  materials?: { title: string; url: string }[];
}

// Mock webinars data
const webinarsData: Webinar[] = [
  {
    id: 1,
    title: "Mastering Modern Frontend Development",
    description: "Learn about the latest trends and best practices in frontend development with React, TypeScript, and modern CSS techniques.",
    speakerName: "John Miller",
    speakerTitle: "Senior Frontend Developer at Google",
    date: "2023-05-25T15:00:00Z",
    registeredUsers: [1, 2, 3],
    category: "Web Development",
    duration: "60 minutes",
    level: "Intermediate",
    tags: ["React", "TypeScript", "CSS"]
  },
  {
    id: 2,
    title: "Technical Interview Strategies",
    description: "Prepare for technical interviews with proven strategies and tips from experienced tech recruiters and hiring managers.",
    speakerName: "Emma Richards",
    speakerTitle: "Tech Recruiter at Amazon",
    date: "2023-05-29T13:00:00Z",
    registeredUsers: [1, 4],
    category: "Career Development",
    duration: "90 minutes",
    level: "All Levels",
    tags: ["Interviews", "Career"]
  },
  {
    id: 3,
    title: "Introduction to Machine Learning",
    description: "Get started with machine learning concepts, algorithms, and practical applications in this beginner-friendly workshop.",
    speakerName: "Michael Rodriguez",
    speakerTitle: "Data Scientist at Microsoft",
    date: "2023-06-05T17:00:00Z",
    registeredUsers: [],
    category: "Data Science",
    duration: "120 minutes",
    level: "Beginner",
    tags: ["Machine Learning", "Python", "Data Science"]
  },
  {
    id: 4,
    title: "Building Scalable Backend Systems",
    description: "Learn how to design and implement scalable backend systems using microservices architecture and cloud technologies.",
    speakerName: "David Chen",
    speakerTitle: "Senior Backend Engineer at Netflix",
    date: "2023-06-10T14:00:00Z",
    registeredUsers: [2],
    category: "Backend Development",
    duration: "90 minutes",
    level: "Advanced",
    tags: ["Microservices", "Cloud", "Scalability"]
  },
  {
    id: 5,
    title: "Effective UI/UX Design Principles",
    description: "Discover key principles for creating user-friendly interfaces and meaningful user experiences for web and mobile applications.",
    speakerName: "Amanda Park",
    speakerTitle: "UI/UX Designer at Adobe",
    date: "2023-06-15T16:00:00Z",
    registeredUsers: [3, 5],
    category: "Design",
    duration: "75 minutes",
    level: "Intermediate",
    tags: ["UI/UX", "Design", "User Experience"]
  },
  {
    id: 6,
    title: "Breaking into Tech: Career Transition Guide",
    description: "A comprehensive guide for professionals looking to transition into tech careers from other industries.",
    speakerName: "Sarah Johnson",
    speakerTitle: "Career Coach and Former Tech Recruiter",
    date: "2023-05-20T15:00:00Z", // Past webinar
    registeredUsers: [1, 3, 4],
    category: "Career Development",
    duration: "90 minutes",
    level: "Beginner",
    tags: ["Career Transition", "Job Search"],
    recording: "https://example.com/recording",
    materials: [
      { title: "Career Transition Roadmap", url: "#" },
      { title: "Resume Template", url: "#" },
      { title: "Networking Strategy Guide", url: "#" }
    ]
  }
];

// Sort function for webinars
function sortWebinars(webinars: Webinar[], userId: number): { upcoming: Webinar[], myUpcoming: Webinar[], past: Webinar[], myPast: Webinar[] } {
  const now = new Date();
  
  // Filter webinars
  const upcoming = webinars.filter(webinar => isAfter(new Date(webinar.date), now))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const past = webinars.filter(webinar => isBefore(new Date(webinar.date), now))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Filter registered webinars
  const myUpcoming = upcoming.filter(webinar => webinar.registeredUsers.includes(userId));
  const myPast = past.filter(webinar => webinar.registeredUsers.includes(userId));
  
  return { upcoming, myUpcoming, past, myPast };
}

export default function Webinars() {
  const { user } = useAuth();
  const userId = user?.id || 0;
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");




  const [selectedWebinar, setSelectedWebinar] = useState<Webinar | null>(null);
  
  // In a real implementation, this would fetch from the API
  // const { data: webinars, isLoading, error } = useQuery<Webinar[]>({
  //   queryKey: ["/api/webinars"],
  // });
  
  // Using mock data for demonstration
  const webinars = webinarsData;
  const isLoading = false;
  const error = null;
  
  // Registration mutation
  const registerMutation = useMutation({
    mutationFn: async (webinarId: number) => {
      // In a real implementation, this would call the API
      // await apiRequest("POST", `/api/webinars/${webinarId}/register`, {});
      
      // For demo purposes, return a success response after a delay
      return new Promise(resolve => setTimeout(() => resolve({ success: true }), 500));
    },
    onSuccess: (_, webinarId) => {
      // In a real implementation, this would invalidate the cache
      // queryClient.invalidateQueries({ queryKey: ["/api/webinars"] });
      
      toast({
        title: "Registration successful",
        description: "You have been registered for the webinar",
      });
      
      // Update selected webinar state to reflect registration
      if (selectedWebinar && selectedWebinar.id === webinarId) {
        setSelectedWebinar({
          ...selectedWebinar,
          registeredUsers: [...selectedWebinar.registeredUsers, userId]
        });
      }
    },
    onError: () => {
      toast({
        title: "Registration failed",
        description: "Could not register for the webinar",
        variant: "destructive"
      });
    }
  });
  
  // Filter webinars based on search term and filters
  const filterWebinars = (webinars: Webinar[]) => {
    return webinars.filter(webinar => {
      const matchesSearch = 
        webinar.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        webinar.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        webinar.speakerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        webinar.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
        const matchesCategory = categoryFilter === "all" || webinar.category === categoryFilter;
        const matchesLevel = levelFilter === "all" || webinar.level === levelFilter;
      
      return matchesSearch && matchesCategory && matchesLevel;
    });
  };
  
  // Sort webinars into categories
  const sortedWebinars = sortWebinars(webinars, userId);
  
  // Apply filters to the appropriate webinar list based on active tab
  const getFilteredWebinars = () => {
    switch (activeTab) {
      case "upcoming":
        return filterWebinars(sortedWebinars.upcoming);
      case "myWebinars":
        return filterWebinars(sortedWebinars.myUpcoming);
      case "past":
        return filterWebinars(sortedWebinars.past);
      default:
        return filterWebinars(sortedWebinars.upcoming);
    }
  };
  
  const filteredWebinars = getFilteredWebinars();
  
  // Handle registration
  const handleRegister = (webinarId: number) => {
    registerMutation.mutate(webinarId);
  };
  
  // Format date for display
  const formatWebinarDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = addDays(today, 1);
    
    const isTodayDate = date.getDate() === today.getDate() && 
                        date.getMonth() === today.getMonth() && 
                        date.getFullYear() === today.getFullYear();
    
    const isTomorrowDate = date.getDate() === tomorrow.getDate() && 
                          date.getMonth() === tomorrow.getMonth() && 
                          date.getFullYear() === tomorrow.getFullYear();
    
    if (isTodayDate) {
      return `Today, ${format(date, "h:mm a")}`;
    } else if (isTomorrowDate) {
      return `Tomorrow, ${format(date, "h:mm a")}`;
    } else {
      return format(date, "EEE, MMM d, h:mm a");
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Webinars & Events</h1>
          <p className="text-gray-600">Participate in live sessions with industry experts</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            <div className="h-64 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Webinars & Events</h1>
          <p className="text-gray-600">Participate in live sessions with industry experts</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-red-500">Failed to load webinars. Please try again later.</p>
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
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Webinars & Events</h1>
        <p className="text-gray-600">Participate in live sessions with industry experts</p>
      </div>
      
      {selectedWebinar ? (
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <Badge className={
                    isAfter(new Date(selectedWebinar.date), new Date()) 
                      ? "bg-green-100 text-green-800" 
                      : "bg-gray-100 text-gray-800"
                  }>
                    {isAfter(new Date(selectedWebinar.date), new Date()) ? "Upcoming" : "Past"}
                  </Badge>
                  <h1 className="text-2xl font-bold mt-2">{selectedWebinar.title}</h1>
                </div>
                <Button variant="outline" onClick={() => setSelectedWebinar(null)}>
                  Back to List
                </Button>
              </div>
              
              <div className="flex flex-col md:flex-row mt-6 space-y-4 md:space-y-0 md:space-x-6">
                <div className="md:w-2/3 space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold mb-2">About This Webinar</h2>
                    <p className="text-gray-700">{selectedWebinar.description}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {selectedWebinar.tags?.map(tag => (
                      <Badge key={tag} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                  
                  {selectedWebinar.recording && (
                    <div>
                      <h2 className="text-lg font-semibold mb-2">Recording</h2>
                      <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                        <Button className="flex items-center">
                          <i className="ri-play-circle-line mr-2 text-lg"></i>
                          Watch Recording
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {selectedWebinar.materials && selectedWebinar.materials.length > 0 && (
                    <div>
                      <h2 className="text-lg font-semibold mb-2">Materials</h2>
                      <div className="space-y-2">
                        {selectedWebinar.materials.map((material, index) => (
                          <Card key={index} className="border border-gray-200">
                            <CardContent className="p-3 flex justify-between items-center">
                              <span className="text-gray-700">{material.title}</span>
                              <Button size="sm" variant="outline" asChild>
                                <a href={material.url} target="_blank" rel="noopener noreferrer">
                                  <i className="ri-download-line mr-1"></i> Download
                                </a>
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="md:w-1/3 space-y-4">
                  <Card>
                    <CardContent className="p-4 space-y-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-16 w-16">
                          <AvatarFallback className="bg-primary-100 text-primary-700 text-lg">
                            {selectedWebinar.speakerName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium text-gray-900">{selectedWebinar.speakerName}</h3>
                          <p className="text-sm text-gray-600">{selectedWebinar.speakerTitle}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3 pt-2">
                        <div className="flex items-center">
                          <i className="ri-calendar-line text-gray-400 w-5"></i>
                          <span className="text-sm text-gray-700">
                            {format(new Date(selectedWebinar.date), "MMMM d, yyyy")}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <i className="ri-time-line text-gray-400 w-5"></i>
                          <span className="text-sm text-gray-700">
                            {format(new Date(selectedWebinar.date), "h:mm a")}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <i className="ri-timer-line text-gray-400 w-5"></i>
                          <span className="text-sm text-gray-700">
                            {selectedWebinar.duration}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <i className="ri-book-open-line text-gray-400 w-5"></i>
                          <span className="text-sm text-gray-700">
                            {selectedWebinar.level}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <i className="ri-folder-line text-gray-400 w-5"></i>
                          <span className="text-sm text-gray-700">
                            {selectedWebinar.category}
                          </span>
                        </div>
                      </div>
                      
                      {isAfter(new Date(selectedWebinar.date), new Date()) && (
                        <div className="pt-2">
                          {selectedWebinar.registeredUsers.includes(userId) ? (
                            <div className="space-y-3">
                              <Badge className="w-full justify-center py-1">You're Registered</Badge>
                              <p className="text-xs text-gray-600 text-center">
                                A calendar invitation and reminder emails have been sent to your email address.
                              </p>
                            </div>
                          ) : (
                            <Button 
                              className="w-full" 
                              onClick={() => handleRegister(selectedWebinar.id)}
                              disabled={registerMutation.isPending}
                            >
                              {registerMutation.isPending ? "Registering..." : "Register Now"}
                            </Button>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  {isAfter(new Date(selectedWebinar.date), new Date()) && (
                    <Card>
                      <CardContent className="p-4">
                        <h3 className="font-medium text-gray-900 mb-2">Add to Calendar</h3>
                        <div className="grid grid-cols-2 gap-2">
                          <Button variant="outline" size="sm" className="w-full">
                            <i className="ri-google-line mr-1"></i> Google
                          </Button>
                          <Button variant="outline" size="sm" className="w-full">
                            <i className="ri-calendar-line mr-1"></i> Outlook
                          </Button>
                          <Button variant="outline" size="sm" className="w-full">
                            <i className="ri-apple-fill mr-1"></i> Apple
                          </Button>
                          <Button variant="outline" size="sm" className="w-full">
                            <i className="ri-download-line mr-1"></i> .ics
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-medium text-gray-900 mb-2">Share This Webinar</h3>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <i className="ri-linkedin-fill text-blue-600 mr-1"></i> LinkedIn
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <i className="ri-twitter-fill text-blue-400 mr-1"></i> Twitter
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <i className="ri-mail-line text-gray-600 mr-1"></i> Email
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <TabsList className="mb-4 md:mb-0">
              <TabsTrigger value="upcoming">Upcoming Webinars</TabsTrigger>
              <TabsTrigger value="myWebinars">My Webinars</TabsTrigger>
              <TabsTrigger value="past">Past Webinars</TabsTrigger>
            </TabsList>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Input 
                placeholder="Search webinars..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-48 md:w-64"
              />
              
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Web Development">Web Development</SelectItem>
                  <SelectItem value="Data Science">Data Science</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Career Development">Career Development</SelectItem>
                  <SelectItem value="Backend Development">Backend Development</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>

                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                  <SelectItem value="All Levels">All Levels</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <TabsContent value="upcoming" className="space-y-6">
            {filteredWebinars.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredWebinars.map(webinar => (
                  <Card key={webinar.id} className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline" className="text-xs">{webinar.category}</Badge>
                        <Badge className="text-xs">{webinar.level}</Badge>
                      </div>
                      <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">{webinar.title}</h3>
                      <p className="text-xs text-gray-500 mb-3">
                        with {webinar.speakerName} • {webinar.speakerTitle}
                      </p>
                      
                      <div className="flex items-center mb-3">
                        <i className="ri-calendar-line text-gray-400 mr-1"></i>
                        <span className="text-xs text-gray-600">{formatWebinarDate(webinar.date)}</span>
                        <span className="mx-2 text-gray-300">•</span>
                        <span className="text-xs text-gray-600">{webinar.duration}</span>
                      </div>
                      
                      <p className="text-sm text-gray-700 mb-4 line-clamp-2">{webinar.description}</p>
                      
                      <div className="flex justify-between items-center">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedWebinar(webinar)}
                        >
                          View Details
                        </Button>
                        
                        {webinar.registeredUsers.includes(userId) ? (
                          <Badge variant="outline" className="text-xs">Registered</Badge>
                        ) : (
                          <Button 
                            size="sm"
                            onClick={() => handleRegister(webinar.id)}
                            disabled={registerMutation.isPending && registerMutation.variables === webinar.id}
                          >
                            Register
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                <p className="text-gray-500">No upcoming webinars found matching your criteria.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="myWebinars" className="space-y-6">
            {filterWebinars(sortedWebinars.myUpcoming).length > 0 ? (
              <div className="space-y-4">
                <h2 className="text-lg font-medium text-gray-900">Your Upcoming Webinars</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filterWebinars(sortedWebinars.myUpcoming).map(webinar => (
                    <Card key={webinar.id} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-gray-900">{webinar.title}</h3>
                          <Badge className="bg-green-100 text-green-800 text-xs">Registered</Badge>
                        </div>
                        
                        <div className="flex items-center mb-3">
                          <i className="ri-calendar-line text-gray-400 mr-1"></i>
                          <span className="text-xs text-gray-600">{formatWebinarDate(webinar.date)}</span>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary-100 text-primary-700 text-xs">
                              {webinar.speakerName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-xs text-gray-600">{webinar.speakerName}</p>
                            <p className="text-xs text-gray-500">{webinar.speakerTitle}</p>
                          </div>
                        </div>
                        
                        <div className="flex justify-end mt-4 space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedWebinar(webinar)}
                          >
                            View Details
                          </Button>
                          <Button size="sm">
                            <i className="ri-calendar-line mr-1"></i> Add to Calendar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {filterWebinars(sortedWebinars.myPast).length > 0 && (
                  <div className="mt-8">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Your Past Webinars</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filterWebinars(sortedWebinars.myPast).map(webinar => (
                        <Card key={webinar.id} className="border border-gray-200">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-medium text-gray-900">{webinar.title}</h3>
                              <Badge variant="outline" className="text-xs">Attended</Badge>
                            </div>
                            
                            <div className="flex items-center mb-3">
                              <i className="ri-calendar-line text-gray-400 mr-1"></i>
                              <span className="text-xs text-gray-600">{format(new Date(webinar.date), "MMMM d, yyyy")}</span>
                            </div>
                            
                            <div className="flex justify-end mt-4">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedWebinar(webinar)}
                              >
                                {webinar.recording ? "Watch Recording" : "View Details"}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                <p className="text-gray-500">You haven't registered for any upcoming webinars.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setActiveTab("upcoming")}
                >
                  Browse Webinars
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="past" className="space-y-6">
            {filteredWebinars.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredWebinars.map(webinar => (
                  <Card key={webinar.id} className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline" className="text-xs">{webinar.category}</Badge>
                        <Badge variant="secondary" className="text-xs">
                          {webinar.registeredUsers.includes(userId) ? "Attended" : "Past"}
                        </Badge>
                      </div>
                      <h3 className="font-medium text-gray-900 mb-1">{webinar.title}</h3>
                      <p className="text-xs text-gray-500 mb-3">
                        with {webinar.speakerName} • {webinar.speakerTitle}
                      </p>
                      
                      <div className="flex items-center mb-3">
                        <i className="ri-calendar-line text-gray-400 mr-1"></i>
                        <span className="text-xs text-gray-600">{format(new Date(webinar.date), "MMMM d, yyyy")}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedWebinar(webinar)}
                        >
                          View Details
                        </Button>
                        
                        {webinar.recording && (
                          <Button 
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedWebinar(webinar)}
                          >
                            <i className="ri-play-circle-line mr-1"></i> Watch Recording
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                <p className="text-gray-500">No past webinars found matching your criteria.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
