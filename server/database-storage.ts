import {
  users,
  healthAssessments,
  journalEntries,
  coachingProgress,
  goals,
  habits,
  moodEntries,
  videos,
  forumCategories,
  forumPosts,
  forumReplies,
  supportGroups,
  supportGroupMembers,

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
import { eq, and, sql } from "drizzle-orm";
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

  // Community operations
  async getForumCategories(): Promise<any[]> {
    return await db.select().from(forumCategories).where(eq(forumCategories.isActive, true));
  }

  async getForumPosts(categoryId?: string, search?: string): Promise<any[]> {
    const posts = await db
      .select({
        id: forumPosts.id,
        title: forumPosts.title,
        content: forumPosts.content,
        isAnonymous: forumPosts.isAnonymous,
        isPinned: forumPosts.isPinned,
        likes: forumPosts.likes,
        views: forumPosts.views,
        replyCount: forumPosts.replyCount,
        lastActivity: forumPosts.lastActivity,
        createdAt: forumPosts.createdAt,
        categoryName: forumCategories.name,
        categoryId: forumPosts.categoryId,
        authorName: users.firstName,
        authorEmail: users.email
      })
      .from(forumPosts)
      .leftJoin(forumCategories, eq(forumPosts.categoryId, forumCategories.id))
      .leftJoin(users, eq(forumPosts.userId, users.id))
      .where(eq(forumPosts.isLocked, false));

    // Filter by category if specified
    let filteredPosts = posts;
    if (categoryId && categoryId !== 'all') {
      filteredPosts = posts.filter(post => post.categoryId === parseInt(categoryId));
    }

    // Sort by pinned status and last activity
    return filteredPosts.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
    });
  }

  async getForumPostById(id: number): Promise<any> {
    const [post] = await db
      .select({
        id: forumPosts.id,
        title: forumPosts.title,
        content: forumPosts.content,
        isAnonymous: forumPosts.isAnonymous,
        isPinned: forumPosts.isPinned,
        likes: forumPosts.likes,
        views: forumPosts.views,
        replyCount: forumPosts.replyCount,
        lastActivity: forumPosts.lastActivity,
        createdAt: forumPosts.createdAt,
        categoryName: forumCategories.name,
        categoryId: forumPosts.categoryId,
        authorName: users.firstName,
        authorEmail: users.email
      })
      .from(forumPosts)
      .leftJoin(forumCategories, eq(forumPosts.categoryId, forumCategories.id))
      .leftJoin(users, eq(forumPosts.userId, users.id))
      .where(eq(forumPosts.id, id));
    
    return post;
  }

  async createForumPost(postData: any): Promise<any> {
    const [newPost] = await db
      .insert(forumPosts)
      .values(postData)
      .returning();
    return newPost;
  }

  async incrementPostViews(postId: number): Promise<void> {
    await db
      .update(forumPosts)
      .set({ views: sql`${forumPosts.views} + 1` })
      .where(eq(forumPosts.id, postId));
  }

  async getForumReplies(postId: number): Promise<any[]> {
    return await db
      .select({
        id: forumReplies.id,
        content: forumReplies.content,
        isAnonymous: forumReplies.isAnonymous,
        likes: forumReplies.likes,
        parentReplyId: forumReplies.parentReplyId,
        createdAt: forumReplies.createdAt,
        authorName: users.firstName,
        authorEmail: users.email
      })
      .from(forumReplies)
      .leftJoin(users, eq(forumReplies.userId, users.id))
      .where(eq(forumReplies.postId, postId))
      .orderBy(forumReplies.createdAt);
  }

  async createForumReply(replyData: any): Promise<any> {
    const [newReply] = await db
      .insert(forumReplies)
      .values(replyData)
      .returning();
    
    // Update reply count on the post
    await db
      .update(forumPosts)
      .set({ 
        replyCount: sql`${forumPosts.replyCount} + 1`,
        lastActivity: new Date()
      })
      .where(eq(forumPosts.id, replyData.postId));
    
    return newReply;
  }

  async getSupportGroups(): Promise<any[]> {
    return await db
      .select({
        id: supportGroups.id,
        name: supportGroups.name,
        description: supportGroups.description,
        type: supportGroups.type,
        category: supportGroups.category,
        maxMembers: supportGroups.maxMembers,
        currentMembers: supportGroups.currentMembers,
        meetingSchedule: supportGroups.meetingSchedule,
        nextMeeting: supportGroups.nextMeeting,
        facilitatorName: users.firstName,
        facilitatorEmail: users.email,
        createdAt: supportGroups.createdAt
      })
      .from(supportGroups)
      .leftJoin(users, eq(supportGroups.facilitatorId, users.id))
      .where(eq(supportGroups.isActive, true))
      .orderBy(supportGroups.createdAt);
  }

  async createSupportGroup(groupData: any): Promise<any> {
    const [newGroup] = await db
      .insert(supportGroups)
      .values(groupData)
      .returning();
    
    // Add creator as facilitator member
    await db.insert(supportGroupMembers).values({
      groupId: newGroup.id,
      userId: groupData.facilitatorId,
      role: 'facilitator'
    });
    
    return newGroup;
  }

  async joinSupportGroup(groupId: number, userId: string): Promise<any> {
    // Check if already a member
    const [existingMember] = await db
      .select()
      .from(supportGroupMembers)
      .where(and(
        eq(supportGroupMembers.groupId, groupId),
        eq(supportGroupMembers.userId, userId),
        eq(supportGroupMembers.isActive, true)
      ));
    
    if (existingMember) {
      return null; // Already a member
    }
    
    // Check if group is full
    const [group] = await db
      .select()
      .from(supportGroups)
      .where(eq(supportGroups.id, groupId));
    
    if (group && group.currentMembers && group.maxMembers && group.currentMembers >= group.maxMembers) {
      return null; // Group is full
    }
    
    // Add member
    const [newMember] = await db
      .insert(supportGroupMembers)
      .values({
        groupId,
        userId,
        role: 'member'
      })
      .returning();
    
    // Update member count
    await db
      .update(supportGroups)
      .set({ currentMembers: sql`${supportGroups.currentMembers} + 1` })
      .where(eq(supportGroups.id, groupId));
    
    return newMember;
  }

  async getSupportGroupMembers(groupId: number): Promise<any[]> {
    return await db
      .select({
        id: supportGroupMembers.id,
        role: supportGroupMembers.role,
        joinedAt: supportGroupMembers.joinedAt,
        memberName: users.firstName,
        memberEmail: users.email
      })
      .from(supportGroupMembers)
      .leftJoin(users, eq(supportGroupMembers.userId, users.id))
      .where(and(
        eq(supportGroupMembers.groupId, groupId),
        eq(supportGroupMembers.isActive, true)
      ))
      .orderBy(supportGroupMembers.joinedAt);
  }


}