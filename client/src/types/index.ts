// User types
export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: "student" | "mentor" | "admin";
  createdAt: string;
}

// Profile types
export interface Education {
  degree: string;
  institution: string;
  year: string;
}

export interface Experience {
  position: string;
  company: string;
  duration: string;
  description?: string;
}

export interface Profile {
  id: number;
  userId: number;
  education: Education[];
  skills: string[];
  careerGoals: string[];
  achievements: string[];
  experience: Experience[];
  completionPercentage: number;
}

// Resume types
export interface ResumeContent {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    address?: string;
    linkedin?: string;
    website?: string;
  };
  objective?: string;
  education: Education[];
  experience: Experience[];
  skills: string[];
  certifications?: string[];
  projects?: Array<{
    name: string;
    description: string;
    technologies: string[];
    url?: string;
  }>;
  awards?: string[];
}

export interface Resume {
  id: number;
  userId: number;
  title: string;
  content: ResumeContent;
  createdAt: string;
  updatedAt: string;
  score: number;
  improvementSuggestions: string[];
}

// Roadmap types
export interface Milestone {
  id: number;
  title: string;
  description: string;
  status: "completed" | "in-progress" | "pending" | "locked";
  progress?: number;
}

export interface Roadmap {
  id: number;
  userId: number;
  milestones: Milestone[];
  currentMilestone: number;
}

// Webinar types
export interface Webinar {
  id: number;
  title: string;
  description: string;
  speakerName: string;
  speakerTitle: string;
  date: string;
  registeredUsers: number[];
}

// Mentor types
export interface Mentor {
  id: number;
  userId: number;
  company: string;
  position: string;
  specialization: string[];
  availability: Record<string, any>;
  verified: boolean;
  matchPercentage?: number;
  user?: {
    firstName: string;
    lastName: string;
  };
}

// Job market types
export interface JobMarketInsight {
  role: string;
  skillDemand: Array<{
    name: string;
    percentage: number;
  }>;
  salaryRange: {
    min: number;
    max: number;
    median: number;
  };
  growthRate: number;
  openings: number;
  locations: Array<{
    name: string;
    percentage: number;
  }>;
}

// Interview prep types
export interface InterviewQuestion {
  id: number;
  category: string;
  question: string;
  difficulty: "easy" | "medium" | "hard";
  answer?: string;
}

export interface InterviewPractice {
  id: number;
  userId: number;
  date: string;
  score: number;
  questions: InterviewQuestion[];
  feedback: string[];
}

// Skill analysis types
export interface SkillAssessment {
  category: string;
  skills: Array<{
    name: string;
    proficiency: number;
    industry: number;
    gap: number;
  }>;
}
