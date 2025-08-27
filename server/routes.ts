import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertProfileSchema, 
  insertResumeSchema, 
  insertRoadmapSchema,
  insertWebinarSchema,
  insertMentorSchema
} from "@shared/schema";
import { z } from "zod";
import { User as UserType } from "@shared/schema";

// Authentication middleware
const authMiddleware = (req: Request, res: Response, next: Function) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication is already set up in setupAuth() called from index.ts
  
  // Create empty profile and default roadmap for newly registered users
  
  // Get user profile by ID
  app.get("/api/users/:id", authMiddleware, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      
      // Ensure user can only access their own profile
      if (req.user && (req.user as UserType).id !== userId) {
        return res.status(403).json({ message: "Forbidden: You can only access your own profile" });
      }
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Don't send the password
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Update user profile
  app.put("/api/users/:id", authMiddleware, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      
      // Ensure user can only update their own profile
      if (req.user && (req.user as UserType).id !== userId) {
        return res.status(403).json({ message: "Forbidden: You can only update your own profile" });
      }
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Update user profile
      const updatedUser = await storage.updateUser(userId, {
        firstName: req.body.firstName || user.firstName,
        lastName: req.body.lastName || user.lastName,
        email: req.body.email || user.email,
        phone: req.body.phone,
        bio: req.body.bio,
      });
      
      if (!updatedUser) {
        return res.status(500).json({ message: "Failed to update user profile" });
      }
      
      // Don't send the password
      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Profile Routes
  app.get("/api/profile", authMiddleware, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      const profile = await storage.getProfile(req.user.id);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.patch("/api/profile", authMiddleware, async (req, res) => {
    try {
      // We'll use a partial validation here
      const updateSchema = insertProfileSchema.partial();
      const profileData = updateSchema.parse(req.body);
      
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      const updatedProfile = await storage.updateProfile(req.user.id, profileData);
      if (!updatedProfile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      
      res.json(updatedProfile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Resume Routes
  app.get("/api/resume", authMiddleware, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      const resume = await storage.getResume(req.user.id);
      if (!resume) {
        return res.status(404).json({ message: "Resume not found" });
      }
      
      res.json(resume);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.post("/api/resume", authMiddleware, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      const resumeData = insertResumeSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      const resume = await storage.createResume(resumeData);
      res.status(201).json(resume);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.patch("/api/resume/:id", authMiddleware, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid resume ID" });
      }
      
      // Partial validation
      const updateSchema = insertResumeSchema.partial();
      const resumeData = updateSchema.parse(req.body);
      
      const resume = await storage.updateResume(id, resumeData);
      if (!resume) {
        return res.status(404).json({ message: "Resume not found" });
      }
      
      res.json(resume);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Roadmap Routes
  app.get("/api/roadmap", authMiddleware, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      const roadmap = await storage.getRoadmap(req.user.id);
      if (!roadmap) {
        return res.status(404).json({ message: "Roadmap not found" });
      }
      
      res.json(roadmap);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Webinar Routes
  app.get("/api/webinars", async (req, res) => {
    try {
      const webinars = await storage.getWebinars();
      res.json(webinars);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.get("/api/webinars/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid webinar ID" });
      }
      
      const webinar = await storage.getWebinar(id);
      if (!webinar) {
        return res.status(404).json({ message: "Webinar not found" });
      }
      
      res.json(webinar);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.post("/api/webinars/:id/register", authMiddleware, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid webinar ID" });
      }
      
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      const success = await storage.registerForWebinar(id, req.user.id);
      if (!success) {
        return res.status(400).json({ message: "Failed to register for webinar" });
      }
      
      res.json({ message: "Successfully registered for webinar" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Mentor Routes
  app.get("/api/mentors", async (req, res) => {
    try {
      const mentors = await storage.getMentors();
      res.json(mentors);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.get("/api/mentors/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid mentor ID" });
      }
      
      const mentor = await storage.getMentor(id);
      if (!mentor) {
        return res.status(404).json({ message: "Mentor not found" });
      }
      
      res.json(mentor);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.post("/api/mentors", authMiddleware, async (req, res) => {
    try {
      // Check if user is already a mentor
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      const existingMentor = await storage.getMentorByUserId(req.user.id);
      if (existingMentor) {
        return res.status(400).json({ message: "You are already registered as a mentor" });
      }
      
      const mentorData = insertMentorSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      const mentor = await storage.createMentor(mentorData);
      res.status(201).json(mentor);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Create HTTP server
  const httpServer = createServer(app);
  
  return httpServer;
}
