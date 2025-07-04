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
  type InsertExperienceReaction
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

  // Journal Entries
  getJournalEntriesByUser(userId: string): Promise<JournalEntry[]>;
  createJournalEntry(entry: InsertJournalEntry): Promise<JournalEntry>;
  deleteJournalEntry(id: number): Promise<void>;

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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private healthAssessments: Map<number, HealthAssessment>;
  private journalEntries: Map<number, JournalEntry>;
  private coachingProgress: Map<number, CoachingProgress>;
  private goals: Map<number, Goal>;
  private habits: Map<number, Habit>;
  private moodEntries: Map<number, MoodEntry>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.healthAssessments = new Map();
    this.journalEntries = new Map();
    this.coachingProgress = new Map();
    this.goals = new Map();
    this.habits = new Map();
    this.moodEntries = new Map();
    this.currentId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  // Health Assessment methods
  async getHealthAssessmentsByUser(userId: number): Promise<HealthAssessment[]> {
    return Array.from(this.healthAssessments.values())
      .filter(assessment => assessment.userId === userId)
      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
  }

  async createHealthAssessment(insertAssessment: InsertHealthAssessment): Promise<HealthAssessment> {
    const id = this.currentId++;
    const assessment: HealthAssessment = {
      ...insertAssessment,
      id,
      completedAt: new Date()
    };
    this.healthAssessments.set(id, assessment);
    return assessment;
  }

  async getLatestHealthAssessment(userId: number, type: string): Promise<HealthAssessment | undefined> {
    const assessments = await this.getHealthAssessmentsByUser(userId);
    return assessments.find(a => a.assessmentType === type);
  }

  // Journal Entry methods
  async getJournalEntriesByUser(userId: number): Promise<JournalEntry[]> {
    return Array.from(this.journalEntries.values())
      .filter(entry => entry.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createJournalEntry(insertEntry: InsertJournalEntry): Promise<JournalEntry> {
    const id = this.currentId++;
    const entry: JournalEntry = {
      ...insertEntry,
      id,
      title: insertEntry.title ?? null,
      mood: insertEntry.mood ?? null,
      prompt: insertEntry.prompt ?? null,
      createdAt: new Date()
    };
    this.journalEntries.set(id, entry);
    return entry;
  }

  async deleteJournalEntry(id: number): Promise<void> {
    this.journalEntries.delete(id);
  }

  // Coaching Progress methods
  async getCoachingProgressByUser(userId: number): Promise<CoachingProgress[]> {
    return Array.from(this.coachingProgress.values())
      .filter(progress => progress.userId === userId)
      .sort((a, b) => a.weekNumber - b.weekNumber);
  }

  async createCoachingProgress(insertProgress: InsertCoachingProgress): Promise<CoachingProgress> {
    const id = this.currentId++;
    const progress: CoachingProgress = {
      ...insertProgress,
      id,
      progress: insertProgress.progress ?? null,
      completed: insertProgress.completed ?? null,
      completedAt: insertProgress.completed ? new Date() : null
    };
    this.coachingProgress.set(id, progress);
    return progress;
  }

  async updateCoachingProgress(id: number, updates: Partial<CoachingProgress>): Promise<CoachingProgress> {
    const existing = this.coachingProgress.get(id);
    if (!existing) {
      throw new Error('Coaching progress not found');
    }
    
    const updated = {
      ...existing,
      ...updates,
      completedAt: updates.completed ? new Date() : existing.completedAt
    };
    
    this.coachingProgress.set(id, updated);
    return updated;
  }

  // Goal methods
  async getGoalsByUser(userId: number): Promise<Goal[]> {
    return Array.from(this.goals.values())
      .filter(goal => goal.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createGoal(insertGoal: InsertGoal): Promise<Goal> {
    const id = this.currentId++;
    const goal: Goal = {
      ...insertGoal,
      id,
      completed: insertGoal.completed ?? null,
      description: insertGoal.description ?? null,
      targetValue: insertGoal.targetValue ?? null,
      currentValue: insertGoal.currentValue ?? null,
      targetDate: insertGoal.targetDate ?? null,
      createdAt: new Date()
    };
    this.goals.set(id, goal);
    return goal;
  }

  async updateGoal(id: number, updates: Partial<Goal>): Promise<Goal> {
    const existing = this.goals.get(id);
    if (!existing) {
      throw new Error('Goal not found');
    }
    
    const updated = { ...existing, ...updates };
    this.goals.set(id, updated);
    return updated;
  }

  async deleteGoal(id: number): Promise<void> {
    this.goals.delete(id);
  }

  // Habit methods
  async getHabitsByUser(userId: number): Promise<Habit[]> {
    return Array.from(this.habits.values())
      .filter(habit => habit.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createHabit(insertHabit: InsertHabit): Promise<Habit> {
    const id = this.currentId++;
    const habit: Habit = {
      ...insertHabit,
      id,
      description: insertHabit.description ?? null,
      streak: insertHabit.streak ?? null,
      lastCompleted: insertHabit.lastCompleted ?? null,
      createdAt: new Date()
    };
    this.habits.set(id, habit);
    return habit;
  }

  async updateHabit(id: number, updates: Partial<Habit>): Promise<Habit> {
    const existing = this.habits.get(id);
    if (!existing) {
      throw new Error('Habit not found');
    }
    
    const updated = { ...existing, ...updates };
    this.habits.set(id, updated);
    return updated;
  }

  async deleteHabit(id: number): Promise<void> {
    this.habits.delete(id);
  }

  // Mood Entry methods
  async getMoodEntriesByUser(userId: number): Promise<MoodEntry[]> {
    return Array.from(this.moodEntries.values())
      .filter(entry => entry.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createMoodEntry(insertEntry: InsertMoodEntry): Promise<MoodEntry> {
    const id = this.currentId++;
    const entry: MoodEntry = {
      ...insertEntry,
      id,
      notes: insertEntry.notes ?? null,
      createdAt: new Date()
    };
    this.moodEntries.set(id, entry);
    return entry;
  }
}

import { DatabaseStorage } from "./database-storage";

export const storage = new DatabaseStorage();
