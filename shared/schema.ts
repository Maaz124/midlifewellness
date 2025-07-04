import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for authentication
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const healthAssessments = pgTable("health_assessments", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  assessmentType: text("assessment_type").notNull(), // 'mental', 'physical', 'cognitive'
  score: integer("score").notNull(),
  responses: jsonb("responses").notNull(),
  completedAt: timestamp("completed_at").defaultNow().notNull(),
});

export const journalEntries = pgTable("journal_entries", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  title: text("title"),
  content: text("content").notNull(),
  mood: text("mood"), // 'very-happy', 'happy', 'neutral', 'sad', 'very-sad'
  prompt: text("prompt"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const coachingProgress = pgTable("coaching_progress", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  weekNumber: integer("week_number").notNull(),
  moduleId: text("module_id").notNull(),
  completed: boolean("completed").default(false),
  completedAt: timestamp("completed_at"),
  progress: integer("progress").default(0), // 0-100
});

export const goals = pgTable("goals", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(), // 'sleep', 'mindfulness', 'exercise', 'self-care'
  targetValue: integer("target_value"),
  currentValue: integer("current_value").default(0),
  targetDate: timestamp("target_date"),
  completed: boolean("completed").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const habits = pgTable("habits", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  frequency: text("frequency").notNull(), // 'daily', 'weekly'
  streak: integer("streak").default(0),
  lastCompleted: timestamp("last_completed"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const moodEntries = pgTable("mood_entries", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  mood: text("mood").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Community Features Tables
export const forumCategories = pgTable("forum_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  color: text("color").default("#6366f1"),
  icon: text("icon").default("MessageCircle"),
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const forumPosts = pgTable("forum_posts", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").references(() => forumCategories.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  isAnonymous: boolean("is_anonymous").default(false),
  isPinned: boolean("is_pinned").default(false),
  isLocked: boolean("is_locked").default(false),
  likes: integer("likes").default(0),
  views: integer("views").default(0),
  replyCount: integer("reply_count").default(0),
  lastActivity: timestamp("last_activity").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const forumReplies = pgTable("forum_replies", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").references(() => forumPosts.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  isAnonymous: boolean("is_anonymous").default(false),
  likes: integer("likes").default(0),
  parentReplyId: integer("parent_reply_id").references(() => forumReplies.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const supportGroups = pgTable("support_groups", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // 'open', 'closed', 'invitation-only'
  category: text("category").notNull(), // 'hormones', 'career', 'relationships', 'general'
  maxMembers: integer("max_members").default(50),
  currentMembers: integer("current_members").default(0),
  meetingSchedule: text("meeting_schedule"),
  nextMeeting: timestamp("next_meeting"),
  facilitatorId: varchar("facilitator_id").references(() => users.id),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const supportGroupMembers = pgTable("support_group_members", {
  id: serial("id").primaryKey(),
  groupId: integer("group_id").references(() => supportGroups.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  role: text("role").default("member"), // 'member', 'facilitator', 'co-facilitator'
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
  isActive: boolean("is_active").default(true),
});

export const peerConnections = pgTable("peer_connections", {
  id: serial("id").primaryKey(),
  requesterId: varchar("requester_id").references(() => users.id).notNull(),
  receiverId: varchar("receiver_id").references(() => users.id).notNull(),
  status: text("status").default("pending"), // 'pending', 'accepted', 'declined', 'blocked'
  connectionType: text("connection_type").default("peer"), // 'peer', 'mentor', 'accountability'
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const userProfiles = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  displayName: text("display_name"),
  bio: text("bio"),
  location: text("location"),
  age: integer("age"),
  joinedProgramWeek: integer("joined_program_week").default(1),
  interests: jsonb("interests"),
  supportAreas: jsonb("support_areas"),
  isPublic: boolean("is_public").default(true),
  allowMessages: boolean("allow_messages").default(true),
  allowConnections: boolean("allow_connections").default(true),
  lastActive: timestamp("last_active").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const sharedExperiences = pgTable("shared_experiences", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(), // 'breakthrough', 'challenge', 'tip', 'question'
  tags: jsonb("tags"),
  isAnonymous: boolean("is_anonymous").default(false),
  likes: integer("likes").default(0),
  supportMessages: integer("support_messages").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const experienceReactions = pgTable("experience_reactions", {
  id: serial("id").primaryKey(),
  experienceId: integer("experience_id").references(() => sharedExperiences.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  reactionType: text("reaction_type").notNull(), // 'like', 'heart', 'support', 'relate'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertHealthAssessmentSchema = createInsertSchema(healthAssessments).omit({
  id: true,
  completedAt: true,
});

export const insertJournalEntrySchema = createInsertSchema(journalEntries).omit({
  id: true,
  createdAt: true,
});

export const insertCoachingProgressSchema = createInsertSchema(coachingProgress).omit({
  id: true,
  completedAt: true,
});

export const insertGoalSchema = createInsertSchema(goals).omit({
  id: true,
  createdAt: true,
});

export const insertHabitSchema = createInsertSchema(habits).omit({
  id: true,
  createdAt: true,
});

export const insertMoodEntrySchema = createInsertSchema(moodEntries).omit({
  id: true,
  createdAt: true,
});

// Community insert schemas
export const insertForumCategorySchema = createInsertSchema(forumCategories).omit({
  id: true,
  createdAt: true,
});

export const insertForumPostSchema = createInsertSchema(forumPosts).omit({
  id: true,
  views: true,
  replyCount: true,
  lastActivity: true,
  createdAt: true,
});

export const insertForumReplySchema = createInsertSchema(forumReplies).omit({
  id: true,
  likes: true,
  createdAt: true,
});

export const insertSupportGroupSchema = createInsertSchema(supportGroups).omit({
  id: true,
  currentMembers: true,
  createdAt: true,
});

export const insertSupportGroupMemberSchema = createInsertSchema(supportGroupMembers).omit({
  id: true,
  joinedAt: true,
});

export const insertPeerConnectionSchema = createInsertSchema(peerConnections).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({
  id: true,
  lastActive: true,
  createdAt: true,
});

export const insertSharedExperienceSchema = createInsertSchema(sharedExperiences).omit({
  id: true,
  likes: true,
  supportMessages: true,
  createdAt: true,
});

export const insertExperienceReactionSchema = createInsertSchema(experienceReactions).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type UpsertUser = typeof users.$inferInsert;

export type InsertHealthAssessment = z.infer<typeof insertHealthAssessmentSchema>;
export type HealthAssessment = typeof healthAssessments.$inferSelect;

export type InsertJournalEntry = z.infer<typeof insertJournalEntrySchema>;
export type JournalEntry = typeof journalEntries.$inferSelect;

export type InsertCoachingProgress = z.infer<typeof insertCoachingProgressSchema>;
export type CoachingProgress = typeof coachingProgress.$inferSelect;

export type InsertGoal = z.infer<typeof insertGoalSchema>;
export type Goal = typeof goals.$inferSelect;

export type InsertHabit = z.infer<typeof insertHabitSchema>;
export type Habit = typeof habits.$inferSelect;

export type InsertMoodEntry = z.infer<typeof insertMoodEntrySchema>;
export type MoodEntry = typeof moodEntries.$inferSelect;

// Community types
export type InsertForumCategory = z.infer<typeof insertForumCategorySchema>;
export type ForumCategory = typeof forumCategories.$inferSelect;

export type InsertForumPost = z.infer<typeof insertForumPostSchema>;
export type ForumPost = typeof forumPosts.$inferSelect;

export type InsertForumReply = z.infer<typeof insertForumReplySchema>;
export type ForumReply = typeof forumReplies.$inferSelect;

export type InsertSupportGroup = z.infer<typeof insertSupportGroupSchema>;
export type SupportGroup = typeof supportGroups.$inferSelect;

export type InsertSupportGroupMember = z.infer<typeof insertSupportGroupMemberSchema>;
export type SupportGroupMember = typeof supportGroupMembers.$inferSelect;

export type InsertPeerConnection = z.infer<typeof insertPeerConnectionSchema>;
export type PeerConnection = typeof peerConnections.$inferSelect;

export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type UserProfile = typeof userProfiles.$inferSelect;

export type InsertSharedExperience = z.infer<typeof insertSharedExperienceSchema>;
export type SharedExperience = typeof sharedExperiences.$inferSelect;

export type InsertExperienceReaction = z.infer<typeof insertExperienceReactionSchema>;
export type ExperienceReaction = typeof experienceReactions.$inferSelect;
