import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";

// Placeholder data for connections
const connectionsData = [
  {
    id: 1,
    name: "David Chen",
    role: "Senior Software Engineer",
    company: "Google",
    skills: ["React", "Node.js", "System Design"],
    connected: true,
    avatar: "DC"
  },
  {
    id: 2,
    name: "Amanda Park",
    role: "Frontend Developer",
    company: "Netflix",
    skills: ["React", "UI/UX", "CSS"],
    connected: true,
    avatar: "AP"
  },
  {
    id: 3,
    name: "Michael Rodriguez",
    role: "Data Scientist",
    company: "Amazon",
    skills: ["Python", "Machine Learning", "Data Visualization"],
    connected: false,
    avatar: "MR"
  },
  {
    id: 4,
    name: "Sarah Johnson",
    role: "Backend Developer",
    company: "Microsoft",
    skills: ["Java", "Spring Boot", "Microservices"],
    connected: false,
    avatar: "SJ"
  },
  {
    id: 5,
    name: "Raj Patel",
    role: "Product Manager",
    company: "Adobe",
    skills: ["Product Strategy", "Agile", "User Research"],
    connected: false,
    avatar: "RP"
  }
];

// Placeholder data for messages
const messagesData = [
  {
    id: 1,
    sender: connectionsData[0],
    content: "Hi there! I saw your profile and thought you might be interested in an upcoming webinar on advanced React patterns. Let me know if you'd like more information!",
    timestamp: "2 days ago",
    read: true
  },
  {
    id: 2,
    sender: connectionsData[1],
    content: "Hello! I'm organizing a frontend developer meetup next month. Would you be interested in attending or perhaps even giving a short talk on your experience?",
    timestamp: "1 week ago",
    read: false
  }
];

// Placeholder data for groups
const groupsData = [
  {
    id: 1,
    name: "Web Development Enthusiasts",
    members: 152,
    description: "A community for web developers to share knowledge, ask questions, and collaborate on projects.",
    joined: true
  },
  {
    id: 2,
    name: "Tech Interview Preparation",
    members: 89,
    description: "Practice coding interviews, share interview experiences, and help each other prepare for tech interviews.",
    joined: true
  },
  {
    id: 3,
    name: "UI/UX Design Discussion",
    members: 118,
    description: "Discuss latest trends in UI/UX design, share resources, and get feedback on your designs.",
    joined: false
  },
  {
    id: 4,
    name: "Career Transition to Tech",
    members: 205,
    description: "Support group for professionals transitioning to tech careers from other fields.",
    joined: false
  }
];

// Placeholder data for events
const eventsData = [
  {
    id: 1,
    title: "Tech Career Fair",
    date: "May 15, 2023",
    time: "10:00 AM - 4:00 PM",
    location: "Virtual",
    description: "Connect with top tech companies hiring for various roles. Perfect opportunity to network and explore job opportunities.",
    attending: false
  },
  {
    id: 2,
    title: "Web Development Workshop",
    date: "May 22, 2023",
    time: "1:00 PM - 3:00 PM",
    location: "Virtual",
    description: "Learn modern web development techniques with practical examples and hands-on exercises.",
    attending: true
  },
  {
    id: 3,
    title: "Tech Leadership Panel",
    date: "June 5, 2023",
    time: "5:00 PM - 6:30 PM",
    location: "Virtual",
    description: "Hear from tech leaders about their career journeys, leadership challenges, and advice for aspiring tech leaders.",
    attending: false
  }
];

// Placeholder data for job referrals
const referralsData = [
  {
    id: 1,
    company: "Google",
    position: "Senior Frontend Developer",
    location: "San Francisco, CA",
    posted: "3 days ago",
    deadline: "May 30, 2023",
    description: "Google is looking for experienced frontend developers to join their team. This role requires expertise in React, TypeScript, and modern web development practices.",
    referrer: connectionsData[0]
  },
  {
    id: 2,
    company: "Amazon",
    position: "Full Stack Engineer",
    location: "Seattle, WA",
    posted: "1 week ago",
    deadline: "June 15, 2023",
    description: "Join Amazon's team to build and scale web applications. Experience with Node.js, React, and AWS services is required.",
    referrer: null
  },
  {
    id: 3,
    company: "Netflix",
    position: "UI Engineer",
    location: "Los Angeles, CA",
    posted: "2 weeks ago",
    deadline: "May 25, 2023",
    description: "Netflix is seeking UI engineers to help build and improve their streaming platform interface. Strong CSS and JavaScript skills are essential.",
    referrer: connectionsData[1]
  }
];

export default function Networking() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("connections");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedConnection, setSelectedConnection] = useState<any>(null);
  const [messageContent, setMessageContent] = useState("");
  
  // Filter connections based on search term
  const filteredConnections = connectionsData.filter(connection => 
    connection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    connection.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    connection.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    connection.skills.some(skill => 
      skill.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  
  // Handle sending a message
  const handleSendMessage = () => {
    if (!messageContent.trim()) {
      toast({
        description: "Please enter a message",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Message sent",
      description: `Your message has been sent to ${selectedConnection.name}`,
    });
    
    setMessageContent("");
    setSelectedConnection(null);
  };
  
  // Handle connection request
  const handleConnect = (connectionId: number) => {
    toast({
      title: "Connection request sent",
      description: "Your connection request has been sent",
    });
  };
  
  // Handle group join
  const handleJoinGroup = (groupId: number) => {
    toast({
      title: "Group joined",
      description: "You've successfully joined the group",
    });
  };
  
  // Handle event RSVP
  const handleRSVP = (eventId: number) => {
    toast({
      title: "RSVP confirmed",
      description: "You're confirmed for this event",
    });
  };
  
  // Handle job application
  const handleApply = (referralId: number) => {
    toast({
      title: "Application initiated",
      description: "You've started the application process",
    });
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Networking & Opportunities</h1>
        <p className="text-gray-600">Connect with peers and mentors, join groups, and discover job opportunities</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="w-full bg-white border border-gray-200 p-1 shadow-sm">
          <TabsTrigger value="connections" className="flex-1">Connections</TabsTrigger>
          <TabsTrigger value="messages" className="flex-1">Messages</TabsTrigger>
          <TabsTrigger value="groups" className="flex-1">Community Groups</TabsTrigger>
          <TabsTrigger value="events" className="flex-1">Networking Events</TabsTrigger>
          <TabsTrigger value="referrals" className="flex-1">Job Referrals</TabsTrigger>
        </TabsList>
        
        {/* Connections Tab */}
        <TabsContent value="connections" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Find Connections</CardTitle>
              <CardDescription>
                Discover peers and mentors in your field of interest
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex w-full mb-4">
                <Input 
                  placeholder="Search by name, role, company, or skill..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-grow"
                />
                <Button variant="outline" className="ml-2">Filter</Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredConnections.map(connection => (
                  <Card key={connection.id} className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <Avatar className="h-12 w-12 border border-gray-200">
                          <AvatarFallback className="bg-primary-100 text-primary-700">
                            {connection.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium text-gray-900">{connection.name}</h3>
                            {connection.connected && (
                              <Badge variant="outline" className="text-xs">Connected</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{connection.role}</p>
                          <p className="text-xs text-gray-500">{connection.company}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {connection.skills.map((skill, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">{skill}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end mt-4 space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setSelectedConnection(connection)}
                        >
                          Message
                        </Button>
                        {!connection.connected && (
                          <Button 
                            size="sm"
                            onClick={() => handleConnect(connection.id)}
                          >
                            Connect
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {filteredConnections.length === 0 && (
                  <div className="col-span-2 text-center py-8">
                    <p className="text-gray-500">No connections found matching your search criteria.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Messages Tab */}
        <TabsContent value="messages" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Messages</CardTitle>
              <CardDescription>
                Stay in touch with your connections
              </CardDescription>
            </CardHeader>
            <CardContent>
              {messagesData.length > 0 ? (
                <div className="space-y-4">
                  {messagesData.map(message => (
                    <Card key={message.id} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-4">
                          <Avatar className="h-10 w-10 border border-gray-200">
                            <AvatarFallback className="bg-primary-100 text-primary-700">
                              {message.sender.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h3 className="font-medium text-gray-900">{message.sender.name}</h3>
                              <span className="text-xs text-gray-500">{message.timestamp}</span>
                            </div>
                            <p className="text-xs text-gray-600">{message.sender.role} at {message.sender.company}</p>
                            <p className="mt-2 text-sm text-gray-700">{message.content}</p>
                          </div>
                        </div>
                        <div className="flex justify-end mt-4">
                          <Button 
                            size="sm"
                            onClick={() => setSelectedConnection(message.sender)}
                          >
                            Reply
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">You have no messages yet.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setActiveTab("connections")}
                  >
                    Find people to message
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Community Groups Tab */}
        <TabsContent value="groups" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Community Groups</CardTitle>
              <CardDescription>
                Join groups to connect with like-minded professionals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {groupsData.map(group => (
                <Card key={group.id} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{group.name}</h3>
                        <p className="text-xs text-gray-600">{group.members} members</p>
                      </div>
                      {group.joined ? (
                        <Badge>Joined</Badge>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleJoinGroup(group.id)}
                        >
                          Join Group
                        </Button>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-gray-700">{group.description}</p>
                    {group.joined && (
                      <div className="mt-4 flex justify-end">
                        <Button size="sm">Go to Group</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Networking Events Tab */}
        <TabsContent value="events" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Networking Events</CardTitle>
              <CardDescription>
                Virtual and in-person events to expand your professional network
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {eventsData.map(event => (
                <Card key={event.id} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{event.title}</h3>
                        <div className="flex items-center mt-1">
                          <i className="ri-calendar-line text-gray-400 text-sm mr-1"></i>
                          <span className="text-xs text-gray-600">{event.date}</span>
                        </div>
                        <div className="flex items-center mt-1">
                          <i className="ri-time-line text-gray-400 text-sm mr-1"></i>
                          <span className="text-xs text-gray-600">{event.time}</span>
                        </div>
                        <div className="flex items-center mt-1">
                          <i className="ri-map-pin-line text-gray-400 text-sm mr-1"></i>
                          <span className="text-xs text-gray-600">{event.location}</span>
                        </div>
                      </div>
                      {event.attending ? (
                        <Badge>Attending</Badge>
                      ) : (
                        <Button 
                          size="sm"
                          onClick={() => handleRSVP(event.id)}
                        >
                          RSVP
                        </Button>
                      )}
                    </div>
                    <p className="mt-3 text-sm text-gray-700">{event.description}</p>
                    {event.attending && (
                      <div className="mt-4 flex justify-end">
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Job Referrals Tab */}
        <TabsContent value="referrals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Referrals</CardTitle>
              <CardDescription>
                Discover job opportunities with referrals from your network
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {referralsData.map(referral => (
                <Card key={referral.id} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{referral.position}</h3>
                        <p className="text-sm text-gray-600">{referral.company}</p>
                        <div className="flex items-center mt-1">
                          <i className="ri-map-pin-line text-gray-400 text-sm mr-1"></i>
                          <span className="text-xs text-gray-600">{referral.location}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Posted: {referral.posted}</p>
                        <p className="text-xs text-gray-500">Deadline: {referral.deadline}</p>
                      </div>
                    </div>
                    
                    <p className="mt-3 text-sm text-gray-700">{referral.description}</p>
                    
                    {referral.referrer && (
                      <div className="mt-3 flex items-center">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarFallback className="bg-primary-100 text-primary-700 text-xs">
                            {referral.referrer.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-gray-600">
                          Referral available through <strong>{referral.referrer.name}</strong>
                        </span>
                      </div>
                    )}
                    
                    <div className="mt-4 flex justify-end space-x-2">
                      {referral.referrer && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setSelectedConnection(referral.referrer)}
                        >
                          Request Referral
                        </Button>
                      )}
                      <Button 
                        size="sm"
                        onClick={() => handleApply(referral.id)}
                      >
                        Apply
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Message Dialog */}
      {selectedConnection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Message {selectedConnection.name}</CardTitle>
              <CardDescription>
                {selectedConnection.role} at {selectedConnection.company}
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
                onClick={() => setSelectedConnection(null)}
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
    </div>
  );
}
