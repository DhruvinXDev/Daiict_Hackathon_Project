import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Progress } from "@/components/ui/progress";

// Simulated course data
const coursesData = [
  {
    id: 1,
    title: "Introduction to React",
    instructor: "Sarah Wilson",
    category: "Web Development",
    level: "Beginner",
    duration: "6 weeks",
    progress: 45,
    description: "Learn the fundamentals of React, including components, state, props, and hooks.",
    lessons: [
      { id: 1, title: "Getting Started with React", completed: true },
      { id: 2, title: "Components and Props", completed: true },
      { id: 3, title: "State and Lifecycle", completed: false },
      { id: 4, title: "Handling Events", completed: false },
      { id: 5, title: "Forms and Controlled Components", completed: false },
      { id: 6, title: "Hooks Introduction", completed: false },
    ]
  },
  {
    id: 2,
    title: "Advanced JavaScript Concepts",
    instructor: "Michael Rodriguez",
    category: "Programming",
    level: "Intermediate",
    duration: "8 weeks",
    progress: 25,
    description: "Deep dive into advanced JavaScript concepts including closures, prototypes, and async programming.",
    lessons: [
      { id: 1, title: "Scope and Closures", completed: true },
      { id: 2, title: "Prototypal Inheritance", completed: true },
      { id: 3, title: "Asynchronous JavaScript", completed: false },
      { id: 4, title: "ES6+ Features", completed: false },
      { id: 5, title: "Design Patterns", completed: false },
      { id: 6, title: "Performance Optimization", completed: false },
    ]
  },
  {
    id: 3,
    title: "UI/UX Design Fundamentals",
    instructor: "Amanda Park",
    category: "Design",
    level: "Beginner",
    duration: "5 weeks",
    progress: 80,
    description: "Learn the principles of user interface and experience design to create intuitive, user-friendly applications.",
    lessons: [
      { id: 1, title: "Design Thinking Process", completed: true },
      { id: 2, title: "User Research Methods", completed: true },
      { id: 3, title: "Information Architecture", completed: true },
      { id: 4, title: "Wireframing and Prototyping", completed: true },
      { id: 5, title: "Visual Design Principles", completed: false },
    ]
  },
  {
    id: 4,
    title: "Algorithm and Data Structures",
    instructor: "David Chen",
    category: "Computer Science",
    level: "Advanced",
    duration: "10 weeks",
    progress: 10,
    description: "A comprehensive course on algorithms and data structures essential for technical interviews and efficient programming.",
    lessons: [
      { id: 1, title: "Introduction to Algorithm Analysis", completed: true },
      { id: 2, title: "Arrays and Linked Lists", completed: false },
      { id: 3, title: "Stacks and Queues", completed: false },
      { id: 4, title: "Trees and Graphs", completed: false },
      { id: 5, title: "Searching Algorithms", completed: false },
      { id: 6, title: "Sorting Algorithms", completed: false },
      { id: 7, title: "Dynamic Programming", completed: false },
    ]
  }
];

// Simulated quiz data
const quizQuestions = [
  {
    id: 1,
    question: "Which of the following is NOT a React hook?",
    options: [
      { id: "a", text: "useState" },
      { id: "b", text: "useEffect" },
      { id: "c", text: "useComponent" },
      { id: "d", text: "useContext" }
    ],
    correct: "c"
  },
  {
    id: 2,
    question: "What does JSX stand for?",
    options: [
      { id: "a", text: "JavaScript XML" },
      { id: "b", text: "JavaScript Experience" },
      { id: "c", text: "JavaScript Extension" },
      { id: "d", text: "JavaScript Syntax" }
    ],
    correct: "a"
  },
  {
    id: 3,
    question: "Which lifecycle method is called after a component is rendered for the first time?",
    options: [
      { id: "a", text: "componentWillMount" },
      { id: "b", text: "componentDidMount" },
      { id: "c", text: "componentWillUpdate" },
      { id: "d", text: "componentDidUpdate" }
    ],
    correct: "b"
  },
  {
    id: 4,
    question: "In React, how do you pass data from a parent component to a child component?",
    options: [
      { id: "a", text: "Using state" },
      { id: "b", text: "Using props" },
      { id: "c", text: "Using context" },
      { id: "d", text: "Using Redux" }
    ],
    correct: "b"
  },
  {
    id: 5,
    question: "What is the correct way to create a state hook in React?",
    options: [
      { id: "a", text: "const [state, setState] = useState(initialValue)" },
      { id: "b", text: "const state = useState(initialValue)" },
      { id: "c", text: "const {state, setState} = useState(initialValue)" },
      { id: "d", text: "const state = new State(initialValue)" }
    ],
    correct: "a"
  }
];

// Simulated resources data
const resourcesData = [
  {
    id: 1,
    title: "React Documentation",
    type: "Documentation",
    source: "React.dev",
    url: "https://react.dev",
    description: "Official React documentation with guides, API references, and examples."
  },
  {
    id: 2,
    title: "JavaScript: The Good Parts",
    type: "Book",
    source: "Douglas Crockford",
    url: "#",
    description: "A book focused on the good features of JavaScript, showing how to create maintainable code."
  },
  {
    id: 3,
    title: "UI/UX Design Principles",
    type: "Article",
    source: "Nielsen Norman Group",
    url: "#",
    description: "Comprehensive guide to user interface and user experience design principles."
  },
  {
    id: 4,
    title: "Introduction to Algorithms",
    type: "Book",
    source: "Cormen, Leiserson, Rivest, Stein",
    url: "#",
    description: "A comprehensive introduction to algorithms, widely used in computer science courses."
  },
  {
    id: 5,
    title: "React Crash Course",
    type: "Video",
    source: "YouTube",
    url: "#",
    description: "A beginner-friendly crash course on React development."
  }
];

export default function Learning() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("courses");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [quizMode, setQuizMode] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  // Filter courses based on search term
  const filteredCourses = coursesData.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.level.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Filter resources based on search term
  const filteredResources = resourcesData.filter(resource => 
    resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Handle starting a quiz
  const handleStartQuiz = () => {
    setQuizMode(true);
    setCurrentQuestion(0);
    setAnswers({});
    setQuizCompleted(false);
  };
  
  // Handle selecting an answer
  const handleSelectAnswer = (questionId: number, answerId: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
  };
  
  // Handle next question
  const handleNextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setQuizCompleted(true);
    }
  };
  
  // Calculate quiz results
  const calculateQuizResults = () => {
    let correctCount = 0;
    
    quizQuestions.forEach(question => {
      if (answers[question.id] === question.correct) {
        correctCount++;
      }
    });
    
    return {
      totalQuestions: quizQuestions.length,
      correctAnswers: correctCount,
      score: Math.round((correctCount / quizQuestions.length) * 100)
    };
  };
  
  // Handle AI assistant question
  const handleAskAi = () => {
    if (!aiQuestion.trim()) {
      toast({
        description: "Please enter a question",
        variant: "destructive"
      });
      return;
    }
    
    setIsAiLoading(true);
    
    // Simulate AI response (would be an actual API call in production)
    setTimeout(() => {
      setAiResponse("Based on your question about React hooks, they are functions that let you 'hook into' React state and lifecycle features from function components. Hooks don't work inside classes — they let you use React without classes. The most commonly used hooks are useState, useEffect, useContext, useReducer, and useRef. They help you manage state, side effects, context, and more in functional components.");
      setIsAiLoading(false);
    }, 1500);
  };
  
  // Handle mark lesson as completed
  const handleMarkComplete = (courseId: number, lessonId: number) => {
    toast({
      title: "Lesson completed",
      description: "Your progress has been updated",
    });
  };
  
  // Back to course list
  const handleBackToCourses = () => {
    setSelectedCourse(null);
    setQuizMode(false);
    setQuizCompleted(false);
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Learning Center</h1>
        <p className="text-gray-600">Expand your knowledge with personalized learning resources</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="w-full bg-white border border-gray-200 p-1 shadow-sm">
          <TabsTrigger value="courses" className="flex-1">My Courses</TabsTrigger>
          <TabsTrigger value="resources" className="flex-1">Learning Resources</TabsTrigger>
          <TabsTrigger value="quizzes" className="flex-1">Quizzes & Exercises</TabsTrigger>
          <TabsTrigger value="assistant" className="flex-1">AI Learning Assistant</TabsTrigger>
        </TabsList>
        
        {/* Courses Tab */}
        <TabsContent value="courses" className="space-y-6">
          {!selectedCourse ? (
            <Card>
              <CardHeader>
                <CardTitle>My Learning Journey</CardTitle>
                <CardDescription>
                  Track your progress and continue learning
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex w-full mb-6">
                  <Input 
                    placeholder="Search courses..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-grow"
                  />
                  <Button variant="outline" className="ml-2">Filter</Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredCourses.map(course => (
                    <Card key={course.id} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-900">{course.title}</h3>
                            <p className="text-xs text-gray-600">Instructor: {course.instructor}</p>
                          </div>
                          <Badge className="text-xs">{course.level}</Badge>
                        </div>
                        <div className="mt-2">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>{course.category}</span>
                            <span>{course.progress}% Complete</span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                        </div>
                        <p className="mt-4 text-sm text-gray-700 line-clamp-2">{course.description}</p>
                        <div className="mt-4 flex justify-end">
                          <Button 
                            size="sm"
                            onClick={() => setSelectedCourse(course)}
                          >
                            Continue Learning
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {filteredCourses.length === 0 && (
                    <div className="col-span-full text-center py-8">
                      <p className="text-gray-500">No courses found matching your search criteria.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{selectedCourse.title}</CardTitle>
                    <CardDescription>
                      {selectedCourse.category} • {selectedCourse.level} • {selectedCourse.duration}
                    </CardDescription>
                  </div>
                  <Button variant="outline" onClick={handleBackToCourses}>
                    Back to Courses
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Course Progress</h3>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Your progress</span>
                    <span>{selectedCourse.progress}%</span>
                  </div>
                  <Progress value={selectedCourse.progress} className="h-2.5" />
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Course Overview</h3>
                  <p className="text-gray-700">{selectedCourse.description}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Lessons</h3>
                  <div className="space-y-3">
                    {selectedCourse.lessons.map((lesson: any, index: number) => (
                      <div key={lesson.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                        <div className="flex items-center">
                          <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                            <span className="text-xs font-medium text-gray-700">{index + 1}</span>
                          </div>
                          <span className={lesson.completed ? "text-gray-600" : "text-gray-900"}>
                            {lesson.title}
                          </span>
                        </div>
                        {lesson.completed ? (
                          <Badge variant="secondary" className="ml-2">Completed</Badge>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleMarkComplete(selectedCourse.id, lesson.id)}
                          >
                            Mark Complete
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-center pt-4">
                  <Button onClick={handleStartQuiz} className="w-full md:w-auto">
                    Take Practice Quiz
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* Resources Tab */}
        <TabsContent value="resources" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Learning Resources</CardTitle>
              <CardDescription>
                Explore curated learning materials for your career goals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex w-full mb-6">
                <Input 
                  placeholder="Search resources..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-grow"
                />
                <Button variant="outline" className="ml-2">Filter</Button>
              </div>
              
              <div className="space-y-4">
                {filteredResources.map(resource => (
                  <Card key={resource.id} className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{resource.title}</h3>
                          <p className="text-xs text-gray-600">Source: {resource.source}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">{resource.type}</Badge>
                      </div>
                      <p className="mt-2 text-sm text-gray-700">{resource.description}</p>
                      <div className="mt-4 flex justify-end">
                        <Button 
                          size="sm"
                          variant="outline"
                          asChild
                        >
                          <a href={resource.url} target="_blank" rel="noopener noreferrer">
                            View Resource
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {filteredResources.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No resources found matching your search criteria.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Quizzes Tab */}
        <TabsContent value="quizzes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quizzes & Practice Exercises</CardTitle>
              <CardDescription>
                Test your knowledge and reinforce your learning
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!quizMode ? (
                <div className="space-y-6">
                  <div className="bg-primary-50 border border-primary-100 rounded-lg p-6 text-center">
                    <h3 className="text-lg font-medium text-primary-800 mb-2">React Fundamentals Quiz</h3>
                    <p className="text-gray-700 mb-4">Test your knowledge of React basics with this 5-question quiz.</p>
                    <Button onClick={handleStartQuiz}>
                      Start Quiz
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="border border-gray-200">
                      <CardContent className="p-4">
                        <h3 className="font-medium text-gray-900 mb-2">JavaScript ES6+ Features</h3>
                        <p className="text-sm text-gray-700 mb-4">Test your knowledge of modern JavaScript features.</p>
                        <div className="flex justify-between items-center">
                          <Badge className="text-xs">10 questions</Badge>
                          <Button size="sm" variant="outline">Start</Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="border border-gray-200">
                      <CardContent className="p-4">
                        <h3 className="font-medium text-gray-900 mb-2">CSS Flexbox & Grid</h3>
                        <p className="text-sm text-gray-700 mb-4">Practice your layout skills with CSS Flexbox and Grid.</p>
                        <div className="flex justify-between items-center">
                          <Badge className="text-xs">5 questions</Badge>
                          <Button size="sm" variant="outline">Start</Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="border border-gray-200">
                      <CardContent className="p-4">
                        <h3 className="font-medium text-gray-900 mb-2">Data Structures Basics</h3>
                        <p className="text-sm text-gray-700 mb-4">Test your understanding of fundamental data structures.</p>
                        <div className="flex justify-between items-center">
                          <Badge className="text-xs">8 questions</Badge>
                          <Button size="sm" variant="outline">Start</Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="border border-gray-200">
                      <CardContent className="p-4">
                        <h3 className="font-medium text-gray-900 mb-2">UI/UX Design Principles</h3>
                        <p className="text-sm text-gray-700 mb-4">Test your knowledge of user interface design principles.</p>
                        <div className="flex justify-between items-center">
                          <Badge className="text-xs">6 questions</Badge>
                          <Button size="sm" variant="outline">Start</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ) : (
                <div>
                  {!quizCompleted ? (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">React Fundamentals Quiz</h3>
                        <span className="text-sm text-gray-600">Question {currentQuestion + 1} of {quizQuestions.length}</span>
                      </div>
                      
                      <Progress value={((currentQuestion + 1) / quizQuestions.length) * 100} className="h-2" />
                      
                      <div className="bg-white p-6 border border-gray-200 rounded-lg">
                        <h4 className="text-lg font-medium mb-4">{quizQuestions[currentQuestion].question}</h4>
                        
                        <RadioGroup
                          value={answers[quizQuestions[currentQuestion].id] || ""}
                          onValueChange={(value) => handleSelectAnswer(quizQuestions[currentQuestion].id, value)}
                          className="space-y-3"
                        >
                          {quizQuestions[currentQuestion].options.map(option => (
                            <div key={option.id} className="flex items-center space-x-2">
                              <RadioGroupItem value={option.id} id={`option-${option.id}`} />
                              <Label htmlFor={`option-${option.id}`} className="flex-grow py-2">{option.text}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                      
                      <div className="flex justify-between">
                        <Button 
                          variant="outline" 
                          onClick={handleBackToCourses}
                        >
                          Exit Quiz
                        </Button>
                        <Button 
                          onClick={handleNextQuestion}
                          disabled={!answers[quizQuestions[currentQuestion].id]}
                        >
                          {currentQuestion < quizQuestions.length - 1 ? "Next Question" : "Finish Quiz"}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="bg-white p-6 border border-gray-200 rounded-lg text-center">
                        <h3 className="text-xl font-bold mb-2">Quiz Results</h3>
                        
                        <div className="inline-flex items-center justify-center p-4 bg-primary-50 rounded-full mb-4">
                          <span className="text-3xl font-bold text-primary-700">{calculateQuizResults().score}%</span>
                        </div>
                        
                        <p className="text-gray-700 mb-2">
                          You got {calculateQuizResults().correctAnswers} out of {calculateQuizResults().totalQuestions} questions correct.
                        </p>
                        
                        {calculateQuizResults().score >= 80 ? (
                          <p className="text-green-600 font-medium">Excellent work! You have a good understanding of React fundamentals.</p>
                        ) : calculateQuizResults().score >= 60 ? (
                          <p className="text-yellow-600 font-medium">Good effort! Review the concepts you missed to improve your understanding.</p>
                        ) : (
                          <p className="text-red-600 font-medium">You might need more practice. Consider reviewing the React fundamentals course.</p>
                        )}
                      </div>
                      
                      <div className="flex justify-between">
                        <Button 
                          variant="outline" 
                          onClick={handleBackToCourses}
                        >
                          Back to Course
                        </Button>
                        <Button 
                          onClick={handleStartQuiz}
                        >
                          Retry Quiz
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* AI Assistant Tab */}
        <TabsContent value="assistant" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Learning Assistant</CardTitle>
              <CardDescription>
                Get instant help with your learning questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-primary-50 p-4 rounded-lg">
                  <p className="text-gray-700">
                    <span className="font-medium">How it works:</span> Ask any question related to programming, web development, 
                    computer science, or career development. The AI assistant will provide personalized answers to help you learn.
                  </p>
                </div>
                
                {aiResponse && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                        <i className="ri-robot-line text-primary-700"></i>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">AI Assistant</p>
                        <p className="text-gray-700">{aiResponse}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="pt-4">
                  <Textarea 
                    placeholder="Ask your learning question here..." 
                    value={aiQuestion}
                    onChange={(e) => setAiQuestion(e.target.value)}
                    className="min-h-32 mb-3"
                  />
                  
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleAskAi}
                      disabled={isAiLoading || !aiQuestion.trim()}
                    >
                      {isAiLoading ? "Processing..." : "Ask AI Assistant"}
                    </Button>
                  </div>
                </div>
                
                <div className="pt-2">
                  <h3 className="font-medium text-gray-900 mb-3">Suggested Questions</h3>
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-left h-auto py-2 px-3"
                      onClick={() => setAiQuestion("What are React hooks and how do they work?")}
                    >
                      What are React hooks and how do they work?
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-left h-auto py-2 px-3"
                      onClick={() => setAiQuestion("Explain the concept of closures in JavaScript.")}
                    >
                      Explain the concept of closures in JavaScript.
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-left h-auto py-2 px-3"
                      onClick={() => setAiQuestion("What's the difference between flexbox and grid in CSS?")}
                    >
                      What's the difference between flexbox and grid in CSS?
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
