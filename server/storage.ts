import { 
  User, InsertUser, 
  Profile, InsertProfile,
  Resume, InsertResume,
  Roadmap, InsertRoadmap,
  Webinar, InsertWebinar,
  Mentor, InsertMentor
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Profile operations
  getProfile(userId: number): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(userId: number, profile: Partial<InsertProfile>): Promise<Profile | undefined>;
  
  // Resume operations
  getResume(userId: number): Promise<Resume | undefined>;
  createResume(resume: InsertResume): Promise<Resume>;
  updateResume(id: number, resume: Partial<InsertResume>): Promise<Resume | undefined>;
  
  // Roadmap operations
  getRoadmap(userId: number): Promise<Roadmap | undefined>;
  createRoadmap(roadmap: InsertRoadmap): Promise<Roadmap>;
  updateRoadmap(userId: number, roadmap: Partial<InsertRoadmap>): Promise<Roadmap | undefined>;
  
  // Webinar operations
  getWebinars(): Promise<Webinar[]>;
  getWebinar(id: number): Promise<Webinar | undefined>;
  createWebinar(webinar: InsertWebinar): Promise<Webinar>;
  registerForWebinar(webinarId: number, userId: number): Promise<boolean>;
  
  // Mentor operations
  getMentors(): Promise<Mentor[]>;
  getMentor(id: number): Promise<Mentor | undefined>;
  getMentorByUserId(userId: number): Promise<Mentor | undefined>;
  createMentor(mentor: InsertMentor): Promise<Mentor>;
  verifyMentor(id: number): Promise<Mentor | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private profiles: Map<number, Profile>; // userId -> Profile
  private resumes: Map<number, Resume>; // userId -> Resume
  private roadmaps: Map<number, Roadmap>; // userId -> Roadmap
  private webinars: Map<number, Webinar>;
  private mentors: Map<number, Mentor>;
  
  private userId: number;
  private profileId: number;
  private resumeId: number;
  private roadmapId: number;
  private webinarId: number;
  private mentorId: number;
  
  constructor() {
    this.users = new Map();
    this.profiles = new Map();
    this.resumes = new Map();
    this.roadmaps = new Map();
    this.webinars = new Map();
    this.mentors = new Map();
    
    this.userId = 1;
    this.profileId = 1;
    this.resumeId = 1;
    this.roadmapId = 1;
    this.webinarId = 1;
    this.mentorId = 1;
    
    // Add sample webinars
    this.seedData();
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const createdAt = new Date();
    const user: User = { ...insertUser, id, createdAt };
    this.users.set(id, user);
    return user;
  }
  
  // Profile operations
  async getProfile(userId: number): Promise<Profile | undefined> {
    return Array.from(this.profiles.values()).find(profile => profile.userId === userId);
  }
  
  async createProfile(insertProfile: InsertProfile): Promise<Profile> {
    const id = this.profileId++;
    const profile: Profile = { ...insertProfile, id };
    this.profiles.set(id, profile);
    return profile;
  }
  
  async updateProfile(userId: number, profileUpdate: Partial<InsertProfile>): Promise<Profile | undefined> {
    const profile = await this.getProfile(userId);
    if (!profile) return undefined;
    
    const updatedProfile: Profile = { ...profile, ...profileUpdate };
    this.profiles.set(profile.id, updatedProfile);
    return updatedProfile;
  }
  
  // Resume operations
  async getResume(userId: number): Promise<Resume | undefined> {
    return Array.from(this.resumes.values()).find(resume => resume.userId === userId);
  }
  
  async createResume(insertResume: InsertResume): Promise<Resume> {
    const id = this.resumeId++;
    const createdAt = new Date();
    const updatedAt = new Date();
    const resume: Resume = { ...insertResume, id, createdAt, updatedAt };
    this.resumes.set(id, resume);
    return resume;
  }
  
  async updateResume(id: number, resumeUpdate: Partial<InsertResume>): Promise<Resume | undefined> {
    const resume = this.resumes.get(id);
    if (!resume) return undefined;
    
    const updatedAt = new Date();
    const updatedResume: Resume = { ...resume, ...resumeUpdate, updatedAt };
    this.resumes.set(id, updatedResume);
    return updatedResume;
  }
  
  // Roadmap operations
  async getRoadmap(userId: number): Promise<Roadmap | undefined> {
    return Array.from(this.roadmaps.values()).find(roadmap => roadmap.userId === userId);
  }
  
  async createRoadmap(insertRoadmap: InsertRoadmap): Promise<Roadmap> {
    const id = this.roadmapId++;
    const roadmap: Roadmap = { ...insertRoadmap, id };
    this.roadmaps.set(id, roadmap);
    return roadmap;
  }
  
  async updateRoadmap(userId: number, roadmapUpdate: Partial<InsertRoadmap>): Promise<Roadmap | undefined> {
    const roadmap = await this.getRoadmap(userId);
    if (!roadmap) return undefined;
    
    const updatedRoadmap: Roadmap = { ...roadmap, ...roadmapUpdate };
    this.roadmaps.set(roadmap.id, updatedRoadmap);
    return updatedRoadmap;
  }
  
  // Webinar operations
  async getWebinars(): Promise<Webinar[]> {
    return Array.from(this.webinars.values());
  }
  
  async getWebinar(id: number): Promise<Webinar | undefined> {
    return this.webinars.get(id);
  }
  
  async createWebinar(insertWebinar: InsertWebinar): Promise<Webinar> {
    const id = this.webinarId++;
    const webinar: Webinar = { ...insertWebinar, id };
    this.webinars.set(id, webinar);
    return webinar;
  }
  
  async registerForWebinar(webinarId: number, userId: number): Promise<boolean> {
    const webinar = this.webinars.get(webinarId);
    if (!webinar) return false;
    
    // Check if user is already registered
    const registeredUsers = webinar.registeredUsers as number[];
    if (registeredUsers.includes(userId)) return false;
    
    // Register user
    webinar.registeredUsers = [...registeredUsers, userId];
    this.webinars.set(webinarId, webinar);
    return true;
  }
  
  // Mentor operations
  async getMentors(): Promise<Mentor[]> {
    return Array.from(this.mentors.values()).filter(mentor => mentor.verified);
  }
  
  async getMentor(id: number): Promise<Mentor | undefined> {
    return this.mentors.get(id);
  }
  
  async getMentorByUserId(userId: number): Promise<Mentor | undefined> {
    return Array.from(this.mentors.values()).find(mentor => mentor.userId === userId);
  }
  
  async createMentor(insertMentor: InsertMentor): Promise<Mentor> {
    const id = this.mentorId++;
    const mentor: Mentor = { ...insertMentor, id };
    this.mentors.set(id, mentor);
    return mentor;
  }
  
  async verifyMentor(id: number): Promise<Mentor | undefined> {
    const mentor = this.mentors.get(id);
    if (!mentor) return undefined;
    
    const verifiedMentor: Mentor = { ...mentor, verified: true };
    this.mentors.set(id, verifiedMentor);
    return verifiedMentor;
  }
  
  // Seed some initial data
  private seedData() {
    // Sample webinars
    this.createWebinar({
      title: "Mastering Modern Frontend Development",
      description: "Learn about the latest trends and best practices in frontend development.",
      speakerName: "John Miller",
      speakerTitle: "Senior Frontend Developer",
      date: new Date(Date.now() + 86400000), // Tomorrow
      registeredUsers: [],
    });
    
    this.createWebinar({
      title: "Technical Interview Strategies",
      description: "Prepare for technical interviews with proven strategies and tips.",
      speakerName: "Emma Richards",
      speakerTitle: "Tech Recruiter",
      date: new Date(Date.now() + 86400000 * 3), // 3 days later
      registeredUsers: [],
    });
  }
}

export const storage = new MemStorage();
