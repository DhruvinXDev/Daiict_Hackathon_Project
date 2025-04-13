import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { AlertCircle, ArrowRight, Lightbulb, MessageSquare, ThumbsUp, Video, Mic, Send } from "lucide-react";

export default function InterviewPrep() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("practice");
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { role: "system", content: "I'm your AI interview coach. How can I help you prepare for your interview today?" },
  ]);

  // Common interview questions by category
  const commonQuestions = {
    behavioral: [
      "Tell me about a time when you had to work under pressure to meet a deadline.",
      "Describe a situation where you had to resolve a conflict with a colleague.",
      "Give an example of a goal you set for yourself and how you achieved it.",
      "Tell me about a time when you had to adapt to a significant change at work.",
      "Describe a situation where you had to make a difficult decision."
    ],
    technical: [
      "What programming languages are you proficient in?",
      "Explain how you would implement a database schema for an e-commerce application.",
      "How would you optimize a slow-performing API endpoint?",
      "Describe your experience with cloud services like AWS, Azure, or GCP.",
      "How do you stay updated with the latest technologies in your field?"
    ],
    situational: [
      "How would you handle a situation where your team is falling behind schedule?",
      "What would you do if you disagree with your manager's decision?",
      "How would you prioritize multiple deadlines?",
      "What approach would you take when introducing a new process to your team?",
      "How would you handle a situation where requirements change mid-project?"
    ]
  };

  // Practice interviews by role
  const practiceInterviews = [
    {
      id: 1,
      title: "Software Developer Interview",
      description: "Practice answering common technical and behavioral questions for a software developer role.",
      duration: "20-30 minutes",
      difficulty: "Intermediate",
      questions: 10,
      category: "Technical"
    },
    {
      id: 2,
      title: "Data Analyst Interview",
      description: "Prepare for data-focused interviews with questions about SQL, data visualization, and analysis.",
      duration: "15-20 minutes",
      difficulty: "Beginner",
      questions: 8,
      category: "Technical"
    },
    {
      id: 3,
      title: "Product Manager Interview",
      description: "Practice answering questions about product strategy, user research, and cross-functional collaboration.",
      duration: "25-35 minutes",
      difficulty: "Advanced",
      questions: 12,
      category: "Behavioral"
    },
    {
      id: 4,
      title: "Marketing Specialist Interview",
      description: "Prepare for questions about marketing strategies, campaign analysis, and digital marketing tools.",
      duration: "20-25 minutes",
      difficulty: "Intermediate",
      questions: 9,
      category: "Mixed"
    }
  ];

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    const newMessage = { role: "user", content: message };
    setChatHistory([...chatHistory, newMessage]);
    
    // Simulate AI response - in a real app, this would call an API
    setTimeout(() => {
      const aiResponse = { 
        role: "system", 
        content: "That's a great question! When answering, be sure to use the STAR method (Situation, Task, Action, Result). Structure your response by first explaining the situation, then detailing what task you were responsible for, followed by the specific actions you took, and finally sharing the results you achieved. This approach will make your answer more compelling and easy to follow."
      };
      setChatHistory(prevChat => [...prevChat, aiResponse]);
    }, 1000);
    
    setMessage("");
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Interview Preparation</h1>
        <p className="text-muted-foreground">Practice for interviews with AI-powered coaching and feedback</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="practice" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            <span>Practice Interviews</span>
          </TabsTrigger>
          <TabsTrigger value="questions" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span>Common Questions</span>
          </TabsTrigger>
          <TabsTrigger value="coach" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            <span>Interview Coach</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Practice Interviews Tab */}
        <TabsContent value="practice" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            {practiceInterviews.map((interview) => (
              <Card key={interview.id}>
                <CardHeader>
                  <CardTitle>{interview.title}</CardTitle>
                  <CardDescription>{interview.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Duration:</span>
                      <span>{interview.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Questions:</span>
                      <span>{interview.questions}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Difficulty:</span>
                      <Badge variant={
                        interview.difficulty === "Beginner" 
                          ? "outline" 
                          : interview.difficulty === "Intermediate" 
                            ? "secondary" 
                            : "default"
                      }>
                        {interview.difficulty}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Category:</span>
                      <span>{interview.category}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    Start Practice
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* Common Questions Tab */}
        <TabsContent value="questions" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Behavioral Questions</CardTitle>
                <CardDescription>Questions about your past experiences and behavior</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {commonQuestions.behavioral.map((question, index) => (
                    <li key={index} className="border-b pb-2 last:border-0">
                      <div className="flex gap-2">
                        <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>{question}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Practice Answers
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Technical Questions</CardTitle>
                <CardDescription>Questions about your technical skills and knowledge</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {commonQuestions.technical.map((question, index) => (
                    <li key={index} className="border-b pb-2 last:border-0">
                      <div className="flex gap-2">
                        <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>{question}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Practice Answers
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Situational Questions</CardTitle>
                <CardDescription>Questions about how you would handle hypothetical situations</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {commonQuestions.situational.map((question, index) => (
                    <li key={index} className="border-b pb-2 last:border-0">
                      <div className="flex gap-2">
                        <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>{question}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Practice Answers
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        {/* Interview Coach Tab */}
        <TabsContent value="coach">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>AI Interview Coach</CardTitle>
              <CardDescription>Ask questions, get advice, or practice your answers with our AI coach</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[400px] flex flex-col">
                <ScrollArea className="flex-1 p-4">
                  {chatHistory.map((msg, index) => (
                    <div 
                      key={index} 
                      className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`px-4 py-2 rounded-lg max-w-[80%] ${
                          msg.role === 'user' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}
                </ScrollArea>
                
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" type="button">
                      <Mic className="h-4 w-4" />
                    </Button>
                    <Input 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Ask a question or practice your answer..." 
                      className="flex-1"
                    />
                    <Button type="button" size="icon" onClick={handleSendMessage}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}