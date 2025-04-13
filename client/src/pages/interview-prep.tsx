import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

export default function InterviewPrep() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("practice");
  const [interviewMode, setInterviewMode] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [answerText, setAnswerText] = useState("");
  const [interviewComplete, setInterviewComplete] = useState(false);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  
  // Mock interview questions data
  const interviewQuestions = [
    {
      id: 1,
      category: "Technical",
      question: "Explain the difference between state and props in React.",
      difficulty: "medium" as const,
      answer: "State is internal and controlled by the component itself, while props are external and controlled by whatever component renders it. State can be changed inside the component, whereas props are passed in from a parent and are immutable from the perspective of the component receiving them."
    },
    {
      id: 2,
      category: "Technical",
      question: "What are closures in JavaScript and how would you use them?",
      difficulty: "hard" as const,
      answer: "A closure is the combination of a function bundled together with references to its surrounding state (the lexical environment). In JavaScript, closures are created every time a function is created. Closures allow a function to access variables from an outer function even after the outer function has returned. They are commonly used for data privacy, function factories, and maintaining state in asynchronous callbacks."
    },
    {
      id: 3,
      category: "Behavioral",
      question: "Tell me about a time when you had to meet a tight deadline.",
      difficulty: "medium" as const,
      answer: "In a previous project, our team was tasked with delivering a critical feature with a shortened timeline due to a strategic business pivot. I organized a priority list, communicated clear expectations with stakeholders, and focused the team on the most essential requirements first. We created a daily check-in process to quickly identify and resolve blockers. By maintaining this structured approach, we successfully delivered the core functionality on time while deferring less critical elements to a subsequent release."
    },
    {
      id: 4,
      category: "Behavioral",
      question: "How do you handle conflicts with team members?",
      difficulty: "easy" as const,
      answer: "When facing conflicts, I first aim to understand the other person's perspective through active listening. I focus on addressing the issue rather than criticizing the person, and I try to find common ground. For example, in a previous role, I had a disagreement with a colleague about an implementation approach. I scheduled a private conversation, listened to their concerns, explained my reasoning, and worked together to find a solution that incorporated the best aspects of both approaches."
    },
    {
      id: 5,
      category: "Technical",
      question: "How would you design a scalable API service?",
      difficulty: "hard" as const,
      answer: "Designing a scalable API service involves several key considerations: First, implementing proper architectural patterns like microservices to enable independent scaling. Second, using stateless design to allow horizontal scaling. Third, implementing efficient caching strategies to reduce database load. Fourth, designing with asynchronous processing for time-consuming operations. Fifth, implementing rate limiting and pagination to prevent abuse. Finally, setting up proper monitoring and auto-scaling policies based on load metrics."
    }
  ];
  
  // Practice interview sessions data
  const practiceSessionsData = [
    {
      id: 1,
      date: "2023-05-10",
      type: "Technical",
      score: 82,
      feedback: [
        "Strong explanation of React concepts",
        "Needs improvement in system design explanations",
        "Good code examples provided"
      ]
    },
    {
      id: 2,
      date: "2023-05-05",
      type: "Behavioral",
      score: 75,
      feedback: [
        "Clear communication style",
        "Could provide more specific examples",
        "Good reflection on past experiences"
      ]
    }
  ];
  
  // Common interview questions data
  const commonQuestionsData = [
    {
      category: "Technical",
      questions: [
        {
          id: 1,
          question: "What is the difference between let, const, and var in JavaScript?",
          difficulty: "easy" as const
        },
        {
          id: 2,
          question: "Explain how the event loop works in JavaScript.",
          difficulty: "medium" as const
        },
        {
          id: 3,
          question: "Describe the differences between REST and GraphQL.",
          difficulty: "medium" as const
        }
      ]
    },
    {
      category: "Behavioral",
      questions: [
        {
          id: 4,
          question: "Tell me about yourself.",
          difficulty: "easy" as const
        },
        {
          id: 5,
          question: "What is your greatest professional achievement?",
          difficulty: "medium" as const
        },
        {
          id: 6,
          question: "Where do you see yourself in 5 years?",
          difficulty: "easy" as const
        }
      ]
    },
    {
      category: "System Design",
      questions: [
        {
          id: 7,
          question: "How would you design Twitter's newsfeed functionality?",
          difficulty: "hard" as const
        },
        {
          id: 8,
          question: "Design a URL shortening service like bit.ly.",
          difficulty: "medium" as const
        }
      ]
    }
  ];
  
  // Start a practice interview
  const startInterview = () => {
    setInterviewMode(true);
    setCurrentQuestion(0);
    setAnswers({});
    setInterviewComplete(false);
    setAnswerText("");
    setAnswerSubmitted(false);
  };
  
  // Submit answer for current question
  const submitAnswer = () => {
    if (!answerText.trim()) {
      toast({
        description: "Please provide an answer before submitting",
        variant: "destructive",
      });
      return;
    }
    
    setAnswers((prev) => ({
      ...prev,
      [interviewQuestions[currentQuestion].id]: answerText,
    }));
    
    setAnswerSubmitted(true);
  };
  
  // Move to next question or complete interview
  const nextQuestion = () => {
    if (currentQuestion < interviewQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setAnswerText("");
      setAnswerSubmitted(false);
    } else {
      setInterviewComplete(true);
    }
  };
  
  // Calculate interview results
  const calculateResults = () => {
    // In a real application, this would involve AI analysis of answers
    // For demo purposes, we'll return a random score
    return {
      score: Math.floor(Math.random() * 30) + 70, // Score between 70-100
      strengths: [
        "Clear explanation of technical concepts",
        "Good use of specific examples",
        "Structured answers with good format"
      ],
      improvements: [
        "Could elaborate more on some technical answers",
        "Consider discussing more about teamwork experiences",
        "Practice conciseness for complex questions"
      ]
    };
  };
  
  // Get badge for difficulty level
  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return <Badge className="bg-green-100 text-green-800">Easy</Badge>;
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case "hard":
        return <Badge className="bg-red-100 text-red-800">Hard</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Interview Preparation</h1>
        <p className="text-gray-600">Practice and improve your interview skills</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="w-full bg-white border border-gray-200 p-1 shadow-sm">
          <TabsTrigger value="practice" className="flex-1">Practice Interviews</TabsTrigger>
          <TabsTrigger value="common" className="flex-1">Common Questions</TabsTrigger>
          <TabsTrigger value="history" className="flex-1">Practice History</TabsTrigger>
          <TabsTrigger value="tips" className="flex-1">Interview Tips</TabsTrigger>
        </TabsList>
        
        {/* Practice Interviews Tab */}
        <TabsContent value="practice" className="space-y-6">
          {!interviewMode ? (
            <Card>
              <CardHeader>
                <CardTitle>Mock Interview Practice</CardTitle>
                <CardDescription>
                  Test your skills with a simulated interview experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg">Technical Interview</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm text-gray-600 mb-4">
                        Practice answering technical questions about programming, system design, and problem-solving.
                      </p>
                      <Button onClick={startInterview}>Start Practice</Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg">Behavioral Interview</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm text-gray-600 mb-4">
                        Practice answering questions about your work experience, teamwork, and problem resolution.
                      </p>
                      <Button onClick={startInterview}>Start Practice</Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg">Full Interview</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm text-gray-600 mb-4">
                        Complete practice session including both technical and behavioral questions.
                      </p>
                      <Button onClick={startInterview}>Start Practice</Button>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Your Interview Readiness</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Technical Interviews</span>
                        <span>82%</span>
                      </div>
                      <Progress value={82} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Behavioral Interviews</span>
                        <span>75%</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>System Design</span>
                        <span>68%</span>
                      </div>
                      <Progress value={68} className="h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : interviewComplete ? (
            <Card>
              <CardHeader>
                <div className="flex justify-between">
                  <div>
                    <CardTitle>Interview Practice Results</CardTitle>
                    <CardDescription>
                      Review your performance and feedback
                    </CardDescription>
                  </div>
                  <Button variant="outline" onClick={() => setInterviewMode(false)}>
                    Back to Practice
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {(() => {
                  const results = calculateResults();
                  return (
                    <>
                      <div>
                        <h3 className="text-lg font-medium mb-3">Overall Score</h3>
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
                            <span className="text-xl font-bold text-primary-700">{results.score}%</span>
                          </div>
                          <div className="flex-1">
                            <Progress value={results.score} className="h-3" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-lg font-medium mb-3">Strengths</h3>
                          <ul className="space-y-2">
                            {results.strengths.map((strength, index) => (
                              <li key={index} className="flex items-start">
                                <i className="ri-check-line text-green-500 mr-2 mt-1"></i>
                                <span className="text-gray-700">{strength}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium mb-3">Areas for Improvement</h3>
                          <ul className="space-y-2">
                            {results.improvements.map((improvement, index) => (
                              <li key={index} className="flex items-start">
                                <i className="ri-arrow-right-line text-yellow-500 mr-2 mt-1"></i>
                                <span className="text-gray-700">{improvement}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-3">Question Review</h3>
                        <div className="space-y-4">
                          {interviewQuestions.map((question, index) => (
                            <Card key={question.id} className="border border-gray-200">
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                  <h4 className="font-medium text-gray-900">{question.question}</h4>
                                  {getDifficultyBadge(question.difficulty)}
                                </div>
                                <p className="text-sm text-gray-600 mb-3">Category: {question.category}</p>
                                
                                <div className="space-y-3">
                                  <div>
                                    <h5 className="text-sm font-medium">Your Answer:</h5>
                                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                                      {answers[question.id] || "No answer provided"}
                                    </p>
                                  </div>
                                  
                                  <div>
                                    <h5 className="text-sm font-medium">Sample Answer:</h5>
                                    <p className="text-sm text-gray-700 bg-green-50 p-3 rounded">
                                      {question.answer}
                                    </p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button onClick={() => setInterviewMode(false)}>
                          Finish Review
                        </Button>
                      </div>
                    </>
                  );
                })()}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <div className="flex justify-between">
                  <div>
                    <CardTitle>Interview Practice</CardTitle>
                    <CardDescription>
                      Question {currentQuestion + 1} of {interviewQuestions.length}
                    </CardDescription>
                  </div>
                  <Button variant="outline" onClick={() => setInterviewMode(false)}>
                    Exit Practice
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-primary-600 h-2.5 rounded-full"
                    style={{ width: `${((currentQuestion + (answerSubmitted ? 1 : 0)) / interviewQuestions.length) * 100}%` }} 
                  ></div>
                </div>
                
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-medium text-gray-900">
                      {interviewQuestions[currentQuestion].question}
                    </h3>
                    <div className="flex items-center">
                      <Badge className="text-xs mr-2">{interviewQuestions[currentQuestion].category}</Badge>
                      {getDifficultyBadge(interviewQuestions[currentQuestion].difficulty)}
                    </div>
                  </div>
                  
                  {!answerSubmitted ? (
                    <div className="space-y-4 mt-4">
                      <Textarea 
                        placeholder="Type your answer here..." 
                        value={answerText}
                        onChange={(e) => setAnswerText(e.target.value)}
                        className="min-h-[150px]"
                      />
                      <div className="flex justify-end">
                        <Button onClick={submitAnswer}>
                          Submit Answer
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 mt-4">
                      <div>
                        <h4 className="font-medium">Your Answer:</h4>
                        <div className="bg-gray-50 p-3 rounded mt-2">
                          <p className="text-gray-700">{answerText}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium">Sample Answer:</h4>
                        <div className="bg-green-50 p-3 rounded mt-2">
                          <p className="text-gray-700">{interviewQuestions[currentQuestion].answer}</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button onClick={nextQuestion}>
                          {currentQuestion < interviewQuestions.length - 1 ? "Next Question" : "Complete Interview"}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* Common Questions Tab */}
        <TabsContent value="common" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Common Interview Questions</CardTitle>
              <CardDescription>
                Prepare for these frequently asked questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="technical" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="technical">Technical</TabsTrigger>
                  <TabsTrigger value="behavioral">Behavioral</TabsTrigger>
                  <TabsTrigger value="system">System Design</TabsTrigger>
                </TabsList>
                
                {commonQuestionsData.map((category) => (
                  <TabsContent key={category.category.toLowerCase()} value={category.category.toLowerCase()} className="space-y-4">
                    {category.questions.map((question) => (
                      <Card key={question.id} className="border border-gray-200">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium text-gray-900">{question.question}</h3>
                            {getDifficultyBadge(question.difficulty)}
                          </div>
                          <div className="flex justify-end mt-3">
                            <Button size="sm">View Answer</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Practice History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Practice History</CardTitle>
              <CardDescription>
                Review your past interview practice sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {practiceSessionsData.length > 0 ? (
                <div className="space-y-4">
                  {practiceSessionsData.map((session) => (
                    <Card key={session.id} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-medium text-gray-900">{session.type} Interview Practice</h3>
                            <p className="text-sm text-gray-600">{session.date}</p>
                          </div>
                          <div className="flex items-center">
                            <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                              <span className="font-medium text-primary-700">{session.score}%</span>
                            </div>
                          </div>
                        </div>
                        
                        <h4 className="text-sm font-medium mb-2">Feedback:</h4>
                        <ul className="space-y-1">
                          {session.feedback.map((item, index) => (
                            <li key={index} className="text-sm text-gray-700 flex items-start">
                              <i className="ri-checkbox-circle-line text-green-500 mr-2"></i>
                              {item}
                            </li>
                          ))}
                        </ul>
                        
                        <div className="flex justify-end mt-3">
                          <Button size="sm" variant="outline">View Details</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">You haven't completed any practice sessions yet.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setActiveTab("practice")}
                  >
                    Start Practice
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Interview Tips Tab */}
        <TabsContent value="tips" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Interview Success Tips</CardTitle>
              <CardDescription>
                Expert advice to help you perform your best
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Technical Interview Tips</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="bg-primary-100 p-2 rounded mr-3 text-primary-600">
                      <i className="ri-checkbox-circle-line"></i>
                    </div>
                    <div>
                      <h4 className="font-medium">Think out loud</h4>
                      <p className="text-sm text-gray-600">Share your thought process as you solve problems. This gives interviewers insight into how you approach challenges.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-primary-100 p-2 rounded mr-3 text-primary-600">
                      <i className="ri-checkbox-circle-line"></i>
                    </div>
                    <div>
                      <h4 className="font-medium">Ask clarifying questions</h4>
                      <p className="text-sm text-gray-600">Don't rush into solutions. Take time to understand the problem and constraints fully.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-primary-100 p-2 rounded mr-3 text-primary-600">
                      <i className="ri-checkbox-circle-line"></i>
                    </div>
                    <div>
                      <h4 className="font-medium">Test your solution</h4>
                      <p className="text-sm text-gray-600">After implementing your solution, test it with different inputs including edge cases.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">Behavioral Interview Tips</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="bg-primary-100 p-2 rounded mr-3 text-primary-600">
                      <i className="ri-checkbox-circle-line"></i>
                    </div>
                    <div>
                      <h4 className="font-medium">Use the STAR method</h4>
                      <p className="text-sm text-gray-600">Structure your answers with Situation, Task, Action, and Result to provide clear and complete responses.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-primary-100 p-2 rounded mr-3 text-primary-600">
                      <i className="ri-checkbox-circle-line"></i>
                    </div>
                    <div>
                      <h4 className="font-medium">Prepare specific examples</h4>
                      <p className="text-sm text-gray-600">Have concrete examples from your experience ready to demonstrate your skills and achievements.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-primary-100 p-2 rounded mr-3 text-primary-600">
                      <i className="ri-checkbox-circle-line"></i>
                    </div>
                    <div>
                      <h4 className="font-medium">Show growth mindset</h4>
                      <p className="text-sm text-gray-600">Demonstrate how you've learned from challenges and continued to develop yourself professionally.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">General Interview Preparation</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="bg-primary-100 p-2 rounded mr-3 text-primary-600">
                      <i className="ri-checkbox-circle-line"></i>
                    </div>
                    <div>
                      <h4 className="font-medium">Research the company</h4>
                      <p className="text-sm text-gray-600">Understand the company's products, culture, and recent news to show your interest and preparation.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-primary-100 p-2 rounded mr-3 text-primary-600">
                      <i className="ri-checkbox-circle-line"></i>
                    </div>
                    <div>
                      <h4 className="font-medium">Prepare questions</h4>
                      <p className="text-sm text-gray-600">Have thoughtful questions ready to ask your interviewers about the role, team, and company.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-primary-100 p-2 rounded mr-3 text-primary-600">
                      <i className="ri-checkbox-circle-line"></i>
                    </div>
                    <div>
                      <h4 className="font-medium">Practice with mock interviews</h4>
                      <p className="text-sm text-gray-600">Regular practice with real-time feedback is the most effective way to improve your interview skills.</p>
                    </div>
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