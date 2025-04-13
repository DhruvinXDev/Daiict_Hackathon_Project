import { pgTable, text, serial, integer, boolean, json, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  userType: text("user_type").notNull(), // "student", "mentor", "admin"
  createdAt: timestamp("created_at").defaultNow(),
});

// Profile schema
export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  education: json("education").notNull(),
  skills: json("skills").notNull(),
  careerGoals: json("career_goals").notNull(),
  achievements: json("achievements").notNull(),
  experience: json("experience").notNull(),
  completionPercentage: integer("completion_percentage").notNull().default(0),
});

// Resume schema
export const resumes = pgTable("resumes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  content: json("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  score: integer("score").default(0),
  improvementSuggestions: json("improvement_suggestions").default([]),
});

// Roadmap schema
export const roadmaps = pgTable("roadmaps", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  milestones: json("milestones").notNull(),
  currentMilestone: integer("current_milestone").default(0),
});

// Webinar schema
export const webinars = pgTable("webinars", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  speakerName: text("speaker_name").notNull(),
  speakerTitle: text("speaker_title").notNull(),
  date: timestamp("date").notNull(),
  registeredUsers: json("registered_users").default([]),
});

// Mentor schema
export const mentors = pgTable("mentors", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  company: text("company").notNull(),
  position: text("position").notNull(),
  specialization: json("specialization").notNull(),
  availability: json("availability").default({}),
  verified: boolean("verified").default(false),
});

// Define Zod schemas for insertion
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertProfileSchema = createInsertSchema(profiles).omit({ id: true });
export const insertResumeSchema = createInsertSchema(resumes).omit({ id: true, createdAt: true, updatedAt: true });
export const insertRoadmapSchema = createInsertSchema(roadmaps).omit({ id: true });
export const insertWebinarSchema = createInsertSchema(webinars).omit({ id: true });
export const insertMentorSchema = createInsertSchema(mentors).omit({ id: true });

// Define types for the schemas
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Profile = typeof profiles.$inferSelect;

export type InsertResume = z.infer<typeof insertResumeSchema>;
export type Resume = typeof resumes.$inferSelect;

export type InsertRoadmap = z.infer<typeof insertRoadmapSchema>;
export type Roadmap = typeof roadmaps.$inferSelect;

export type InsertWebinar = z.infer<typeof insertWebinarSchema>;
export type Webinar = typeof webinars.$inferSelect;

export type InsertMentor = z.infer<typeof insertMentorSchema>;
export type Mentor = typeof mentors.$inferSelect;
