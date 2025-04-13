import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Mentor } from "@/types";

// Sample mentors data
const mentorsData: Mentor[] = [
  {
    id: 1,
    userId: 101,
    company: "Google",
    position: "Senior Software Engineer",
    specialization: ["React", "Node.js", "System Design"],
    availability: {
      monday: ["10:00", "14:00", "16:00"],
      wednesday: ["11:00", "15:00"],
      friday: ["10:00", "13:00"]
    },
    verified: true,
    matchPercentage: 95,
    user: {
      firstName: "David",
      lastName: "Chen"
    }
  },
  {
    id: 2,
    userId: 102,
    company: "Netflix",
    position: "Frontend Developer",
    specialization: ["React", "UI/UX", "CSS"],
    availability: {
      tuesday: ["09:00", "13:00"],
      thursday: ["14:00", "16:00"]
    },
    verified: true,
    matchPercentage: 89,
    user: {
      firstName: "Amanda",
      lastName: "Park"
    }
  },
  {
    id: 3,
    userId: 103,
    company: "Microsoft",
    position: "Backend Developer",
    specialization: ["Java", "Spring Boot", "Microservices"],
    availability: {
      monday: ["09:00", "11:00"],
      wednesday: ["10:00", "14:00"],
      friday: ["15:00"]
    },
    verified: true,
    matchPercentage: 82,
    user: {
      firstName: "Sarah",
      lastName: "Johnson"
    }
  },
  {
    id: 4,
    userId: 104,
    company: "Amazon",
    position: "Data Scientist",
    specialization: ["Python", "Machine Learning", "Data Visualization"],
    availability: {
      tuesday: ["10:00", "15:00"],
      thursday: ["11:00", "16:00"]
    },
    verified: true,
    matchPercentage: 78,
    user: {
      firstName: "Michael",
      lastName: "Rodriguez"
    }
  },
  {
    id: 5,
    userId: 105,
    company: "Adobe",
    position: "Product Manager",
    specialization: ["Product Strategy", "Agile", "User Research"],
    availability: {
      monday: ["13:00", "17:00"],
      wednesday: ["09:00", "12:00"]
    },
    verified: true,
    matchPercentage: 72,
    user: {
      firstName: "Raj",
      lastName: "Patel"
    }
  }
];

// Sample sessions data
const sessionsData = [
  {
    id: 1,
    mentor: mentorsData[0],
    date: "2023-05-25",
    time: "14:00",
    status: "upcoming",
    topic: "Career transition to big tech"
  },
  {
    id: 2,
    mentor: mentorsData[1],
    date: "2023-05-18",
    time: "13:00",
    status: "completed",
    topic: "Portfolio review & feedback",
    feedback: "Great session! Amanda provided valuable insights on improving my portfolio design and content organization."
  }
];

// Sample mentorship applications data
const applicationsData = [
  {
    id: 1,
    company: "TechCorp",
    position: "Senior Frontend Developer",
    experience: "5 years",
    specialization: ["React", "Vue.js", "CSS/SCSS"],
    status: "pending"
  }
];

export default function Mentors() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("discover");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [filterSpecialization, setFilterSpecialization] = useState<string>("");
  const [bookingMentor, setBookingMentor] = useState<Mentor | null>(null);
  const [bookingDate, setBookingDate] = useState<Date | undefined>(undefined);
  const [bookingTime, setBookingTime] = useState<string>("");
  const [bookingTopic, setBookingTopic] = useState("");
  const [messageContent, setMessageContent] = useState("");
  
  // Filter mentors based on search term and filter
  const filteredMentors = mentorsData.filter(mentor => {
    const matchesSearch = 
      (mentor.user?.firstName + " " + mentor.user?.lastName).toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.specialization.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterSpecialization === "" || 
      mentor.specialization.some(skill => skill.toLowerCase() === filterSpecialization.toLowerCase());
    
    return matchesSearch && matchesFilter;
  });
  
  // Handle booking a session
  const handleBookSession = () => {
    if (!bookingDate || !bookingTime || !bookingTopic.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Session booked",
      description: `Your session with ${bookingMentor?.user?.firstName} has been booked successfully.`,
    });
    
    setBookingMentor(null);
    setBookingDate(undefined);
    setBookingTime("");
    setBookingTopic("");
  };
  
  // Handle sending a message
  const handleSendMessage = () => {
    if (!messageContent.trim()) {
      toast({
        title: "Empty message",
        description: "Please enter a message",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Message sent",
      description: `Your message has been sent to ${selectedMentor?.user?.firstName}.`,
    });
    
    setMessageContent("");
    setSelectedMentor(null);
  };
  
  // Handle mentor application
  const handleMentorApplication = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Application submitted",
      description: "Your application to become a mentor has been submitted for review.",
    });
    
    setActiveTab("myApplications");
  };
  
  // Get available times for selected date
  const getAvailableTimesForDate = (date: Date | undefined, mentor: Mentor | null) => {
    if (!date || !mentor) return [];
    
    const dayOfWeek = format(date, "EEEE").toLowerCase();
    return mentor.availability[dayOfWeek as keyof typeof mentor.availability] || [];
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mentors & Guidance</h1>
        <p className="text-gray-600">Connect with industry professionals to accelerate your career growth</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="w-full bg-white border border-gray-200 p-1 shadow-sm">
          <TabsTrigger value="discover" className="flex-1">Discover Mentors</TabsTrigger>
          <TabsTrigger value="sessions" className="flex-1">My Sessions</TabsTrigger>
          <TabsTrigger value="becomeMentor" className="flex-1">Become a Mentor</TabsTrigger>
          <TabsTrigger value="myApplications" className="flex-1">My Applications</TabsTrigger>
        </TabsList>
        
        {/* Discover Mentors Tab */}
        <TabsContent value="discover" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Find Your Ideal Mentor</CardTitle>
              <CardDescription>
                Connect with experienced professionals in your field of interest
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row w-full mb-6 gap-2">
                <Input 
                  placeholder="Search by name, role, company, or skill..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-grow"
                />
                <Select value={filterSpecialization} onValueChange={setFilterSpecialization}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Filter by specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Specializations</SelectItem>
                    <SelectItem value="React">React</SelectItem>
                    <SelectItem value="Node.js">Node.js</SelectItem>
                    <SelectItem value="Python">Python</SelectItem>
                    <SelectItem value="Java">Java</SelectItem>
                    <SelectItem value="UI/UX">UI/UX</SelectItem>
                    <SelectItem value="Machine Learning">Machine Learning</SelectItem>
                    <SelectItem value="Product Strategy">Product Strategy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredMentors.map(mentor => (
                  <Card key={mentor.id} className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <Avatar className="h-16 w-16 border border-gray-200">
                          <AvatarFallback className="bg-primary-100 text-primary-700 text-xl">
                            {mentor.user?.firstName?.[0]}{mentor.user?.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium text-gray-900">
                              {mentor.user?.firstName} {mentor.user?.lastName}
                            </h3>
                            <Badge className="ml-2" variant="secondary">
                              {mentor.matchPercentage}% Match
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{mentor.position}</p>
                          <p className="text-xs text-gray-500">{mentor.company}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {mentor.specialization.map((skill, i) => (
                              <Badge key={i} variant="outline" className="text-xs">{skill}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end mt-4 space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setSelectedMentor(mentor)}
                        >
                          Message
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => setBookingMentor(mentor)}
                        >
                          Book Session
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {filteredMentors.length === 0 && (
                  <div className="col-span-2 text-center py-8">
                    <p className="text-gray-500">No mentors found matching your criteria.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* My Sessions Tab */}
        <TabsContent value="sessions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>My Mentoring Sessions</CardTitle>
              <CardDescription>
                Track and manage your upcoming and past sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Upcoming Sessions</h3>
                  {sessionsData.filter(session => session.status === "upcoming").length > 0 ? (
                    <div className="space-y-4">
                      {sessionsData
                        .filter(session => session.status === "upcoming")
                        .map(session => (
                          <Card key={session.id} className="border border-gray-200">
                            <CardContent className="p-4">
                              <div className="flex items-start space-x-4">
                                <Avatar className="h-12 w-12">
                                  <AvatarFallback className="bg-primary-100 text-primary-700">
                                    {session.mentor.user?.firstName?.[0]}{session.mentor.user?.lastName?.[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex justify-between items-start">
                                    <h3 className="font-medium text-gray-900">
                                      Session with {session.mentor.user?.firstName} {session.mentor.user?.lastName}
                                    </h3>
                                    <Badge>Upcoming</Badge>
                                  </div>
                                  <p className="text-sm text-gray-600">{session.topic}</p>
                                  <div className="flex items-center mt-2 space-x-4">
                                    <div className="flex items-center">
                                      <i className="ri-calendar-line text-gray-400 mr-1"></i>
                                      <span className="text-sm text-gray-600">{format(new Date(session.date), "MMMM d, yyyy")}</span>
                                    </div>
                                    <div className="flex items-center">
                                      <i className="ri-time-line text-gray-400 mr-1"></i>
                                      <span className="text-sm text-gray-600">{session.time}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex justify-end mt-4 space-x-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                >
                                  Reschedule
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                >
                                  Cancel
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
                      <p className="text-gray-500">You have no upcoming sessions.</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => setActiveTab("discover")}
                      >
                        Find mentors
                      </Button>
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Past Sessions</h3>
                  {sessionsData.filter(session => session.status === "completed").length > 0 ? (
                    <div className="space-y-4">
                      {sessionsData
                        .filter(session => session.status === "completed")
                        .map(session => (
                          <Card key={session.id} className="border border-gray-200">
                            <CardContent className="p-4">
                              <div className="flex items-start space-x-4">
                                <Avatar className="h-12 w-12">
                                  <AvatarFallback className="bg-primary-100 text-primary-700">
                                    {session.mentor.user?.firstName?.[0]}{session.mentor.user?.lastName?.[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex justify-between items-start">
                                    <h3 className="font-medium text-gray-900">
                                      Session with {session.mentor.user?.firstName} {session.mentor.user?.lastName}
                                    </h3>
                                    <Badge variant="outline">Completed</Badge>
                                  </div>
                                  <p className="text-sm text-gray-600">{session.topic}</p>
                                  <div className="flex items-center mt-2 space-x-4">
                                    <div className="flex items-center">
                                      <i className="ri-calendar-line text-gray-400 mr-1"></i>
                                      <span className="text-sm text-gray-600">{format(new Date(session.date), "MMMM d, yyyy")}</span>
                                    </div>
                                    <div className="flex items-center">
                                      <i className="ri-time-line text-gray-400 mr-1"></i>
                                      <span className="text-sm text-gray-600">{session.time}</span>
                                    </div>
                                  </div>
                                  {session.feedback && (
                                    <div className="mt-3 bg-gray-50 p-3 rounded-md">
                                      <p className="text-xs font-medium text-gray-900 mb-1">Your Feedback:</p>
                                      <p className="text-sm text-gray-700">{session.feedback}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex justify-end mt-4">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                >
                                  Book Again
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
                      <p className="text-gray-500">You have no past sessions.</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Become a Mentor Tab */}
        <TabsContent value="becomeMentor" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Become a Mentor</CardTitle>
              <CardDescription>
                Share your expertise and help others grow in their careers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-primary-50 border border-primary-100 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-primary-800 mb-2">Why Become a Mentor?</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <i className="ri-check-line text-primary-600 mr-2 mt-1"></i>
                      <span>Share your knowledge and experience with aspiring professionals</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-check-line text-primary-600 mr-2 mt-1"></i>
                      <span>Build your professional network and reputation</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-check-line text-primary-600 mr-2 mt-1"></i>
                      <span>Develop your leadership and communication skills</span>
                    </li>
                    <li className="flex items-start">
                      <i className="ri-check-line text-primary-600 mr-2 mt-1"></i>
                      <span>Make a positive impact on someone's career journey</span>
                    </li>
                  </ul>
                </div>
                
                <form onSubmit={handleMentorApplication} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900">Current Company</label>
                    <Input required placeholder="e.g., Google, Amazon, etc." />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900">Current Position</label>
                    <Input required placeholder="e.g., Senior Software Engineer" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900">Years of Experience</label>
                    <Input required type="number" min="2" placeholder="e.g., 5" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900">Areas of Expertise (select up to 5)</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {["JavaScript", "React", "Node.js", "Python", "Java", "UI/UX Design", 
                        "Product Management", "Data Science", "Machine Learning", "Cloud Computing", 
                        "DevOps", "Cybersecurity", "Blockchain", "Mobile Development", "Technical Leadership"].map(skill => (
                        <div key={skill} className="flex items-center space-x-2">
                          <Checkbox id={`skill-${skill}`} />
                          <label htmlFor={`skill-${skill}`} className="text-sm text-gray-700">{skill}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900">Mentoring Experience</label>
                    <Select defaultValue="some">
                      <SelectTrigger>
                        <SelectValue placeholder="Select your level of experience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No prior experience</SelectItem>
                        <SelectItem value="some">Some informal experience</SelectItem>
                        <SelectItem value="moderate">Moderate experience</SelectItem>
                        <SelectItem value="extensive">Extensive experience</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900">Why do you want to be a mentor?</label>
                    <Textarea required placeholder="Share your motivation and what you hope to achieve as a mentor..." className="min-h-32" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900">Availability</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs text-gray-700">Days of the week</label>
                        <div className="grid grid-cols-2 gap-2">
                          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
                            <div key={day} className="flex items-center space-x-2">
                              <Checkbox id={`day-${day}`} />
                              <label htmlFor={`day-${day}`} className="text-sm text-gray-700">{day}</label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-gray-700">Preferred time slots</label>
                        <div className="grid grid-cols-2 gap-2">
                          {["Morning", "Afternoon", "Evening"].map(time => (
                            <div key={time} className="flex items-center space-x-2">
                              <Checkbox id={`time-${time}`} />
                              <label htmlFor={`time-${time}`} className="text-sm text-gray-700">{time}</label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button type="submit" className="w-full">Submit Application</Button>
                  </div>
                </form>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* My Applications Tab */}
        <TabsContent value="myApplications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>My Mentor Applications</CardTitle>
              <CardDescription>
                Track the status of your mentorship applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              {applicationsData.length > 0 ? (
                <div className="space-y-4">
                  {applicationsData.map(application => (
                    <Card key={application.id} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-900">{application.position}</h3>
                            <p className="text-sm text-gray-600">{application.company}</p>
                            <p className="text-xs text-gray-500">{application.experience} of experience</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {application.specialization.map((skill, i) => (
                                <Badge key={i} variant="outline" className="text-xs">{skill}</Badge>
                              ))}
                            </div>
                          </div>
                          <Badge className={
                            application.status === "approved" ? "bg-green-100 text-green-800" :
                            application.status === "rejected" ? "bg-red-100 text-red-800" :
                            "bg-yellow-100 text-yellow-800"
                          }>
                            {application.status === "pending" ? "Under Review" : 
                             application.status === "approved" ? "Approved" : "Rejected"}
                          </Badge>
                        </div>
                        {application.status === "pending" && (
                          <div className="mt-4 bg-yellow-50 p-3 rounded-md">
                            <p className="text-sm text-yellow-800">
                              Your application is currently being reviewed. This process typically takes 3-5 business days.
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-500">You haven't submitted any mentor applications yet.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setActiveTab("becomeMentor")}
                  >
                    Apply to be a mentor
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Message Dialog */}
      {selectedMentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Message {selectedMentor.user?.firstName} {selectedMentor.user?.lastName}</CardTitle>
              <CardDescription>
                {selectedMentor.position} at {selectedMentor.company}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea 
                placeholder="Write your message here..." 
                className="min-h-32"
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
              />
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setSelectedMentor(null)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSendMessage}
              >
                Send Message
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
      
      {/* Booking Dialog */}
      {bookingMentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Book a Session with {bookingMentor.user?.firstName}</CardTitle>
              <CardDescription>
                {bookingMentor.position} at {bookingMentor.company}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900">Select Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !bookingDate && "text-muted-foreground"
                        )}
                      >
                        <i className="ri-calendar-line mr-2"></i>
                        {bookingDate ? format(bookingDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={bookingDate}
                        onSelect={setBookingDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900">Select Time</label>
                  <Select 
                    value={bookingTime} 
                    onValueChange={setBookingTime}
                    disabled={!bookingDate}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableTimesForDate(bookingDate, bookingMentor).length > 0 ? (
                        getAvailableTimesForDate(bookingDate, bookingMentor).map(time => (
                          <SelectItem key={time} value={time}>{time}</SelectItem>
                        ))
                      ) : (
                        <SelectItem value="" disabled>
                          No available times for this date
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  {bookingDate && getAvailableTimesForDate(bookingDate, bookingMentor).length === 0 && (
                    <p className="text-xs text-yellow-600">
                      No available times for the selected date. Please choose another date.
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900">Session Topic</label>
                  <Textarea 
                    placeholder="What would you like to discuss in this session?" 
                    value={bookingTopic}
                    onChange={(e) => setBookingTopic(e.target.value)}
                    className="min-h-24"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setBookingMentor(null)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleBookSession}
                disabled={!bookingDate || !bookingTime || !bookingTopic.trim()}
              >
                Book Session
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
