import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { useState, useEffect } from "react";

export default function HomePage() {
  const { user } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Background patterns for animation
  const backgroundPatterns = [
    "bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-blue-600/10",
    "bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-indigo-500/10",
    "bg-gradient-to-br from-orange-500/10 via-yellow-500/10 to-orange-600/10",
    "bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-purple-600/10",
    "bg-gradient-to-br from-pink-500/10 via-rose-500/10 to-pink-600/10"
  ];

  // Auto-rotate background patterns every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % backgroundPatterns.length
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [backgroundPatterns.length]);

  const features = [
    {
      icon: "ri-ai-generate",
      title: "AI-Powered Career Guidance",
      description: "Get personalized career recommendations based on your skills, interests, and market trends.",
      color: "text-blue-500"
    },
    {
      icon: "ri-file-list-line",
      title: "Smart Resume Builder",
      description: "Create ATS-friendly resumes with AI suggestions and real-time optimization.",
      color: "text-green-500"
    },
    {
      icon: "ri-road-map-line",
      title: "Career Roadmap",
      description: "Visualize your career path with step-by-step guidance and milestone tracking.",
      color: "text-purple-500"
    },
    {
      icon: "ri-user-star-line",
      title: "Expert Mentorship",
      description: "Connect with industry professionals for personalized guidance and networking.",
      color: "text-orange-500"
    },
    {
      icon: "ri-bar-chart-grouped-line",
      title: "Skill Analysis",
      description: "Analyze your skills gap and get recommendations for improvement.",
      color: "text-red-500"
    },
    {
      icon: "ri-video-chat-line",
      title: "Interview Prep",
      description: "Practice interviews with AI-powered feedback and industry-specific questions.",
      color: "text-indigo-500"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer",
      company: "Google",
      content: "CareerVerse helped me identify the right skills to focus on. The AI recommendations were spot-on!",
      avatar: "SC"
    },
    {
      name: "Marcus Rodriguez",
      role: "Product Manager",
      company: "Microsoft",
      content: "The mentorship program connected me with amazing industry leaders. Game-changer for my career!",
      avatar: "MR"
    },
    {
      name: "Priya Patel",
      role: "Data Scientist",
      company: "Amazon",
      content: "The resume builder is incredible. I got 3 job offers within 2 weeks of using it!",
      avatar: "PP"
    }
  ];

  const stats = [
    { number: "50K+", label: "Active Users" },
    { number: "95%", label: "Success Rate" },
    { number: "200+", label: "Expert Mentors" },
    { number: "1M+", label: "Resumes Built" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Animated Background */}
      <section className="relative overflow-hidden py-20">
        {/* Animated Background Patterns */}
        <div className="absolute inset-0 transition-all duration-1000 ease-in-out">
          {backgroundPatterns.map((pattern, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${pattern} ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
        </div>
        
        {/* Mesh pattern overlay */}
        <div className="absolute inset-0 bg-mesh opacity-30"></div>
        
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-white/70 dark:bg-black/70"></div>
        
        {/* Content */}
        <div className="relative container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-6 text-sm font-medium">
            🚀 AI-Powered Career Platform
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6">
            Your Career Journey
            <span className="text-gradient block">Starts Here</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            CareerVerse combines artificial intelligence with expert mentorship to guide you through 
            every step of your professional development. Build skills, create opportunities, and 
            achieve your career goals.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            {user ? (
              <Link href="/">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/auth">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3">
                    Get Started Free
                  </Button>
                </Link>
                <Link href="/auth">
                  <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-muted px-8 py-3">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive platform provides all the tools and resources you need to advance your career.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 border-border hover:border-primary/20">
                <CardHeader>
                  <div className={`text-4xl mb-4 ${feature.color}`}>
                    <i className={feature.icon}></i>
                  </div>
                  <CardTitle className="text-xl text-foreground">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How CareerVerse Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to transform your career
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Create Your Profile</h3>
              <p className="text-muted-foreground">
                Build your professional profile with skills, experience, and career goals.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-secondary">2</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Get AI Insights</h3>
              <p className="text-muted-foreground">
                Receive personalized recommendations and career path guidance.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-accent">3</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Take Action</h3>
              <p className="text-muted-foreground">
                Build skills, connect with mentors, and advance your career.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Hear from professionals who transformed their careers with CareerVerse
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 border-border">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                      <span className="text-lg font-semibold text-primary">{testimonial.avatar}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role} at {testimonial.company}</div>
                    </div>
                  </div>
                  <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who are already advancing their careers with CareerVerse.
          </p>
          
          {user ? (
            <Link href="/">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90 px-8 py-3">
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <Link href="/auth">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90 px-8 py-3">
                Start Your Journey
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="bg-primary text-primary-foreground p-2 rounded-lg mr-3">
                  <i className="ri-rocket-2-fill text-xl"></i>
                </div>
                <h3 className="text-xl font-bold text-foreground">CareerVerse</h3>
              </div>
              <p className="text-muted-foreground">
                Your AI-powered career companion for professional growth and success.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Platform</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/resume-builder" className="hover:text-foreground">Resume Builder</Link></li>
                <li><Link href="/career-roadmap" className="hover:text-foreground">Career Roadmap</Link></li>
                <li><Link href="/mentors" className="hover:text-foreground">Mentorship</Link></li>
                <li><Link href="/skill-analysis" className="hover:text-foreground">Skill Analysis</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Resources</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/learning" className="hover:text-foreground">Learning Paths</Link></li>
                <li><Link href="/webinars" className="hover:text-foreground">Webinars</Link></li>
                <li><Link href="/interview-prep" className="hover:text-foreground">Interview Prep</Link></li>
                <li><Link href="/job-market" className="hover:text-foreground">Job Market</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/settings" className="hover:text-foreground">Help Center</Link></li>
                <li><Link href="/settings" className="hover:text-foreground">Contact Us</Link></li>
                <li><Link href="/settings" className="hover:text-foreground">Privacy Policy</Link></li>
                <li><Link href="/settings" className="hover:text-foreground">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 CareerVerse. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
