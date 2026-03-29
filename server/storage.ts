import { 
  users, 
  healthAssessments,
  journalEntries,
  coachingProgress,
  goals,
  habits,
  moodEntries,
  forumCategories,
  forumPosts,
  forumReplies,
  supportGroups,
  supportGroupMembers,
  peerConnections,
  userProfiles,
  sharedExperiences,
  experienceReactions,
  type User, 
  type InsertUser,
  type UpsertUser,
  type HealthAssessment,
  type InsertHealthAssessment,
  type JournalEntry,
  type InsertJournalEntry,
  type CoachingProgress,
  type InsertCoachingProgress,
  type Goal,
  type InsertGoal,
  type Habit,
  type InsertHabit,
  type MoodEntry,
  type InsertMoodEntry,
  type ForumCategory,
  type InsertForumCategory,
  type ForumPost,
  type InsertForumPost,
  type ForumReply,
  type InsertForumReply,
  type SupportGroup,
  type InsertSupportGroup,
  type SupportGroupMember,
  type InsertSupportGroupMember,
  type PeerConnection,
  type InsertPeerConnection,
  type UserProfile,
  type InsertUserProfile,
  type SharedExperience,
  type InsertSharedExperience,
  type ExperienceReaction,
  type InsertExperienceReaction,
  type DigitalResource,
  type InsertDigitalResource,
  type ResourcePurchase,
  type InsertResourcePurchase,
  type ResourceDownload,
  type InsertResourceDownload,
  type Lead,
  type InsertLead,
  type Video,
  type InsertVideo
} from "@shared/schema";

export interface IStorage {
  // Users (Replit Auth compatible)
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Health Assessments
  getHealthAssessmentsByUser(userId: string): Promise<HealthAssessment[]>;
  createHealthAssessment(assessment: InsertHealthAssessment): Promise<HealthAssessment>;
  getLatestHealthAssessment(userId: string, type: string): Promise<HealthAssessment | undefined>;
  upsertHealthAssessment(assessment: InsertHealthAssessment): Promise<HealthAssessment>;

  // Journal Entries
  getJournalEntriesByUser(userId: string): Promise<JournalEntry[]>;
  createJournalEntry(entry: InsertJournalEntry): Promise<JournalEntry>;
  upsertJournalEntryForToday(entry: InsertJournalEntry): Promise<JournalEntry>;
  deleteJournalEntry(id: number, userId: string): Promise<void>;

  // Coaching Progress
  getCoachingProgressByUser(userId: string): Promise<CoachingProgress[]>;
  createCoachingProgress(progress: InsertCoachingProgress): Promise<CoachingProgress>;
  updateCoachingProgress(id: number, updates: Partial<CoachingProgress>): Promise<CoachingProgress>;

  // Goals
  getGoalsByUser(userId: string): Promise<Goal[]>;
  createGoal(goal: InsertGoal): Promise<Goal>;
  updateGoal(id: number, updates: Partial<Goal>): Promise<Goal>;
  deleteGoal(id: number): Promise<void>;

  // Habits
  getHabitsByUser(userId: string): Promise<Habit[]>;
  createHabit(habit: InsertHabit): Promise<Habit>;
  updateHabit(id: number, updates: Partial<Habit>): Promise<Habit>;
  deleteHabit(id: number): Promise<void>;

  // Mood Entries
  getMoodEntriesByUser(userId: string): Promise<MoodEntry[]>;
  createMoodEntry(entry: InsertMoodEntry): Promise<MoodEntry>;

  // Gratitude Entries
  getGratitudeEntriesByUser(userId: string): Promise<any[]>;
  createGratitudeEntry(entry: any): Promise<any>;

  // Videos (for future use)
  getVideos(): Promise<Video[]>;
  getVideoById(id: number): Promise<Video | undefined>;
  getVideosByModule(moduleId: string): Promise<Video[]>;
  getVideosByWeek(weekNumber: number): Promise<Video[]>;
  createVideo(video: InsertVideo): Promise<Video>;
  updateVideo(id: number, updates: Partial<Video>): Promise<Video>;
  deleteVideo(id: number): Promise<void>;

  // Digital Resources
  getDigitalResources(): Promise<DigitalResource[]>;
  getDigitalResourceById(id: number): Promise<DigitalResource | undefined>;
  createDigitalResource(resource: InsertDigitalResource): Promise<DigitalResource>;
  updateDigitalResource(id: number, updates: Partial<DigitalResource>): Promise<DigitalResource>;
  deleteDigitalResource(id: number): Promise<void>;

  // Resource Purchases
  createResourcePurchase(purchase: InsertResourcePurchase): Promise<ResourcePurchase>;
  getUserResourcePurchases(userId: string): Promise<ResourcePurchase[]>;
  hasUserPurchasedResource(userId: string, resourceId: number): Promise<boolean>;
  updateResourcePurchaseStatus(paymentIntentId: string, status: string): Promise<void>;

  // Resource Downloads
  createResourceDownload(download: InsertResourceDownload): Promise<ResourceDownload>;
  getUserResourceDownloads(userId: string): Promise<ResourceDownload[]>;

  // Leads & Marketing
  createLead(lead: InsertLead): Promise<Lead>;
  getLeads(): Promise<Lead[]>;

  // Forum & Community (Minimal interfaces for storage class)
  getForumCategories(): Promise<any[]>;
  getForumPosts(categoryId?: string, search?: string): Promise<any[]>;
  getForumPostById(id: number): Promise<any>;
  createForumPost(postData: any): Promise<any>;
  incrementPostViews(postId: number): Promise<void>;
  getForumReplies(postId: number): Promise<any[]>;
  createForumReply(replyData: any): Promise<any>;
  getSupportGroups(): Promise<any[]>;
  createSupportGroup(groupData: any): Promise<any>;
  joinSupportGroup(groupId: number, userId: string): Promise<any>;
  getSupportGroupMembers(groupId: number): Promise<any[]>;
  createCoachingInquiry(inquiryData: any): Promise<any>;
  getCoachingInquiries(): Promise<any[]>;
  getCoachingInquiryById(id: number): Promise<any>;
  updateCoachingInquiryStatus(id: number, status: string): Promise<any>;
}

export class MemStorage implements IStorage {
  private userStore: Map<string, User>;
  private healthStore: Map<number, HealthAssessment>;
  private journalStore: Map<number, JournalEntry>;
  private progressStore: Map<number, CoachingProgress>;
  private goalStore: Map<number, Goal>;
  private habitStore: Map<number, Habit>;
  private moodStore: Map<number, MoodEntry>;
  private gratitudeStore: Map<number, any>;
  private leadStore: Map<number, Lead>;
  private currentId: number;

  constructor() {
    this.userStore = new Map();
    this.healthStore = new Map();
    this.journalStore = new Map();
    this.progressStore = new Map();
    this.goalStore = new Map();
    this.habitStore = new Map();
    this.moodStore = new Map();
    this.gratitudeStore = new Map();
    this.leadStore = new Map();
    this.currentId = 1;
  }

  async getUser(id: string): Promise<User | undefined> { return Array.from(this.userStore.values()).find(u => u.id === id); }
  async getUserByUsername(username: string): Promise<User | undefined> { return undefined; }
  async createUser(user: InsertUser): Promise<User> { const id = this.currentId++; const res = { ...user, id: id.toString(), createdAt: new Date() } as User; this.userStore.set(id, res); return res; }
  async upsertUser(user: UpsertUser): Promise<User> { const res = { ...user, updatedAt: new Date() } as User; this.userStore.set(Number(user.id), res); return res; }
  
  async getHealthAssessmentsByUser(userId: string): Promise<HealthAssessment[]> {
    return Array.from(this.healthStore.values()).filter(a => String(a.userId) === String(userId));
  }
  async createHealthAssessment(a: InsertHealthAssessment): Promise<HealthAssessment> { const id = this.currentId++; const res = { ...a, id, completedAt: new Date() }; this.healthStore.set(id, res); return res; }
  async getLatestHealthAssessment(userId: string, type: string): Promise<HealthAssessment | undefined> { return undefined; }
  async upsertHealthAssessment(a: InsertHealthAssessment): Promise<HealthAssessment> { return this.createHealthAssessment(a); }

  async getJournalEntriesByUser(userId: string): Promise<JournalEntry[]> { return Array.from(this.journalStore.values()).filter(e => e.userId === userId); }
  async createJournalEntry(e: InsertJournalEntry): Promise<JournalEntry> { const id = this.currentId++; const res = { ...e, id, createdAt: new Date(), title: e.title || null, mood: e.mood || null, prompt: e.prompt || null }; this.journalStore.set(id, res); return res; }
  async upsertJournalEntryForToday(e: InsertJournalEntry): Promise<JournalEntry> { return this.createJournalEntry(e); }
  async deleteJournalEntry(id: number, userId: string): Promise<void> { this.journalStore.delete(id); }

  async getCoachingProgressByUser(userId: string): Promise<CoachingProgress[]> { return []; }
  async createCoachingProgress(p: InsertCoachingProgress): Promise<CoachingProgress> { const id = this.currentId++; const res = { ...p, id, progress: p.progress || 0, completed: p.completed || false, completedAt: null, responseData: null }; this.progressStore.set(id, res); return res; }
  async updateCoachingProgress(id: number, u: Partial<CoachingProgress>): Promise<CoachingProgress> { throw new Error("Method not implemented."); }

  async getGoalsByUser(userId: string): Promise<Goal[]> { return []; }
  async createGoal(g: InsertGoal): Promise<Goal> { const id = this.currentId++; const res = { ...g, id, createdAt: new Date(), description: g.description || null, targetValue: g.targetValue || null, currentValue: g.currentValue || 0, targetDate: g.targetDate || null, completed: g.completed || false }; this.goalStore.set(id, res); return res; }
  async updateGoal(id: number, u: Partial<Goal>): Promise<Goal> { throw new Error("Method not implemented."); }
  async deleteGoal(id: number): Promise<void> { this.goalStore.delete(id); }

  async getHabitsByUser(userId: string): Promise<Habit[]> { return []; }
  async createHabit(h: InsertHabit): Promise<Habit> { const id = this.currentId++; const res = { ...h, id, createdAt: new Date(), description: h.description || null, streak: 0, lastCompleted: null }; this.habitStore.set(id, res); return res; }
  async updateHabit(id: number, u: Partial<Habit>): Promise<Habit> { throw new Error("Method not implemented."); }
  async deleteHabit(id: number): Promise<void> { this.habitStore.delete(id); }

  async getMoodEntriesByUser(userId: string): Promise<MoodEntry[]> { return []; }
  async createMoodEntry(e: InsertMoodEntry): Promise<MoodEntry> { const id = this.currentId++; const res = { ...e, id, createdAt: new Date(), notes: e.notes || null }; this.moodStore.set(id, res); return res; }

  async getGratitudeEntriesByUser(userId: string): Promise<any[]> { return []; }
  async createGratitudeEntry(e: any): Promise<any> { const id = this.currentId++; const res = { ...e, id, savedAt: new Date() }; this.gratitudeStore.set(id, res); return res; }

  async getVideos(): Promise<Video[]> { return []; }
  async getVideoById(id: number): Promise<Video | undefined> { return undefined; }
  async getVideosByModule(m: string): Promise<Video[]> { return []; }
  async getVideosByWeek(w: number): Promise<Video[]> { return []; }
  async createVideo(v: InsertVideo): Promise<Video> { throw new Error("Method not implemented."); }
  async updateVideo(id: number, u: Partial<Video>): Promise<Video> { throw new Error("Method not implemented."); }
  async deleteVideo(id: number): Promise<void> {}

  async getDigitalResources(): Promise<DigitalResource[]> { return []; }
  async getDigitalResourceById(id: number): Promise<DigitalResource | undefined> { return undefined; }
  async createDigitalResource(r: InsertDigitalResource): Promise<DigitalResource> { throw new Error("Method not implemented."); }
  async updateDigitalResource(id: number, u: Partial<DigitalResource>): Promise<DigitalResource> { throw new Error("Method not implemented."); }
  async deleteDigitalResource(id: number): Promise<void> {}

  async createResourcePurchase(p: InsertResourcePurchase): Promise<ResourcePurchase> { throw new Error("Method not implemented."); }
  async getUserResourcePurchases(u: string): Promise<ResourcePurchase[]> { return []; }
  async hasUserPurchasedResource(u: string, r: number): Promise<boolean> { return false; }
  async updateResourcePurchaseStatus(pi: string, s: string): Promise<void> {}

  async createResourceDownload(d: InsertResourceDownload): Promise<ResourceDownload> { throw new Error("Method not implemented."); }
  async getUserResourceDownloads(u: string): Promise<ResourceDownload[]> { return []; }

  async createLead(lead: InsertLead): Promise<Lead> { const id = this.currentId++; const res = { ...lead, id, createdAt: new Date(), convertedAt: null, lastEngaged: new Date(), status: 'active', leadScore: 0, tags: [] } as Lead; this.leadStore.set(id, res); return res; }
  async getLeads(): Promise<Lead[]> { return Array.from(this.leadStore.values()); }

  async getForumCategories(): Promise<any[]> { return []; }
  async getForumPosts(): Promise<any[]> { return []; }
  async getForumPostById(): Promise<any> { return null; }
  async createForumPost(): Promise<any> { return null; }
  async incrementPostViews(): Promise<void> {}
  async getForumReplies(): Promise<any[]> { return []; }
  async createForumReply(): Promise<any> { return null; }
  async getSupportGroups(): Promise<any[]> { return []; }
  async createSupportGroup(): Promise<any> { return null; }
  async joinSupportGroup(): Promise<any> { return null; }
  async getSupportGroupMembers(): Promise<any[]> { return []; }
  async createCoachingInquiry(): Promise<any> { return null; }
  async getCoachingInquiries(): Promise<any[]> { return []; }
  async getCoachingInquiryById(): Promise<any> { return null; }
  async updateCoachingInquiryStatus(): Promise<any> { return null; }
}

import { DatabaseStorage } from "./database-storage";

export const storage = new DatabaseStorage();
