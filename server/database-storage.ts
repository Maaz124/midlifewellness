import {
  users,
  healthAssessments,
  journalEntries,
  coachingProgress,
  goals,
  habits,
  moodEntries,
  videos,
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
  type Video,
  type InsertVideo,
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";
import { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  // User operations for Replit Auth
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    // For Replit Auth, we don't have username - this is legacy method
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Health Assessments
  async getHealthAssessmentsByUser(userId: string): Promise<HealthAssessment[]> {
    return await db
      .select()
      .from(healthAssessments)
      .where(eq(healthAssessments.userId, userId));
  }

  async createHealthAssessment(assessment: InsertHealthAssessment): Promise<HealthAssessment> {
    const [newAssessment] = await db
      .insert(healthAssessments)
      .values(assessment)
      .returning();
    return newAssessment;
  }

  async getLatestHealthAssessment(userId: string, type: string): Promise<HealthAssessment | undefined> {
    const [assessment] = await db
      .select()
      .from(healthAssessments)
      .where(and(eq(healthAssessments.userId, userId), eq(healthAssessments.assessmentType, type)))
      .orderBy(healthAssessments.completedAt)
      .limit(1);
    return assessment;
  }

  // Journal Entries
  async getJournalEntriesByUser(userId: string): Promise<JournalEntry[]> {
    return await db
      .select()
      .from(journalEntries)
      .where(eq(journalEntries.userId, userId))
      .orderBy(journalEntries.createdAt);
  }

  async createJournalEntry(entry: InsertJournalEntry): Promise<JournalEntry> {
    const [newEntry] = await db
      .insert(journalEntries)
      .values(entry)
      .returning();
    return newEntry;
  }

  async deleteJournalEntry(id: number): Promise<void> {
    await db.delete(journalEntries).where(eq(journalEntries.id, id));
  }

  // Coaching Progress
  async getCoachingProgressByUser(userId: string): Promise<CoachingProgress[]> {
    return await db
      .select()
      .from(coachingProgress)
      .where(eq(coachingProgress.userId, userId));
  }

  async createCoachingProgress(progress: InsertCoachingProgress): Promise<CoachingProgress> {
    const [newProgress] = await db
      .insert(coachingProgress)
      .values(progress)
      .returning();
    return newProgress;
  }

  async updateCoachingProgress(id: number, updates: Partial<CoachingProgress>): Promise<CoachingProgress> {
    const [updatedProgress] = await db
      .update(coachingProgress)
      .set(updates)
      .where(eq(coachingProgress.id, id))
      .returning();
    return updatedProgress;
  }

  // Goals
  async getGoalsByUser(userId: string): Promise<Goal[]> {
    return await db
      .select()
      .from(goals)
      .where(eq(goals.userId, userId))
      .orderBy(goals.createdAt);
  }

  async createGoal(goal: InsertGoal): Promise<Goal> {
    const [newGoal] = await db
      .insert(goals)
      .values(goal)
      .returning();
    return newGoal;
  }

  async updateGoal(id: number, updates: Partial<Goal>): Promise<Goal> {
    const [updatedGoal] = await db
      .update(goals)
      .set(updates)
      .where(eq(goals.id, id))
      .returning();
    return updatedGoal;
  }

  async deleteGoal(id: number): Promise<void> {
    await db.delete(goals).where(eq(goals.id, id));
  }

  // Habits
  async getHabitsByUser(userId: string): Promise<Habit[]> {
    return await db
      .select()
      .from(habits)
      .where(eq(habits.userId, userId))
      .orderBy(habits.createdAt);
  }

  async createHabit(habit: InsertHabit): Promise<Habit> {
    const [newHabit] = await db
      .insert(habits)
      .values(habit)
      .returning();
    return newHabit;
  }

  async updateHabit(id: number, updates: Partial<Habit>): Promise<Habit> {
    const [updatedHabit] = await db
      .update(habits)
      .set(updates)
      .where(eq(habits.id, id))
      .returning();
    return updatedHabit;
  }

  async deleteHabit(id: number): Promise<void> {
    await db.delete(habits).where(eq(habits.id, id));
  }

  // Mood Entries
  async getMoodEntriesByUser(userId: string): Promise<MoodEntry[]> {
    return await db
      .select()
      .from(moodEntries)
      .where(eq(moodEntries.userId, userId))
      .orderBy(moodEntries.createdAt);
  }

  async createMoodEntry(entry: InsertMoodEntry): Promise<MoodEntry> {
    const [newEntry] = await db
      .insert(moodEntries)
      .values(entry)
      .returning();
    return newEntry;
  }

  // Video operations (for future use)
  async getVideos(): Promise<Video[]> {
    return await db.select().from(videos).where(eq(videos.isActive, true));
  }

  async getVideoById(id: number): Promise<Video | undefined> {
    const [video] = await db.select().from(videos).where(eq(videos.id, id));
    return video;
  }

  async getVideosByModule(moduleId: string): Promise<Video[]> {
    return await db.select().from(videos).where(
      and(eq(videos.moduleId, moduleId), eq(videos.isActive, true))
    );
  }

  async getVideosByWeek(weekNumber: number): Promise<Video[]> {
    return await db.select().from(videos).where(
      and(eq(videos.weekNumber, weekNumber), eq(videos.isActive, true))
    );
  }

  async createVideo(video: InsertVideo): Promise<Video> {
    const [newVideo] = await db
      .insert(videos)
      .values(video)
      .returning();
    return newVideo;
  }

  async updateVideo(id: number, updates: Partial<Video>): Promise<Video> {
    const [updatedVideo] = await db
      .update(videos)
      .set(updates)
      .where(eq(videos.id, id))
      .returning();
    return updatedVideo;
  }

  async deleteVideo(id: number): Promise<void> {
    await db.update(videos).set({ isActive: false }).where(eq(videos.id, id));
  }
}