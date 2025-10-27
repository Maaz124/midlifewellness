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

// User storage table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique().notNull(),
  passwordHash: varchar("password_hash", { length: 255 }),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  phone: varchar("phone", { length: 20 }),
  profileImageUrl: varchar("profile_image_url"),
  emailVerified: boolean("email_verified").default(false),
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

export const postLikes = pgTable("post_likes", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").references(() => forumPosts.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const replyLikes = pgTable("reply_likes", {
  id: serial("id").primaryKey(),
  replyId: integer("reply_id").references(() => forumReplies.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const coachingInquiries = pgTable("coaching_inquiries", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  coachingType: text("coaching_type").notNull(), // 'group', 'individual', 'both'
  preferredSchedule: text("preferred_schedule"),
  experience: text("experience"),
  goals: text("goals").notNull(),
  challenges: text("challenges"),
  additionalInfo: text("additional_info"),
  status: text("status").default("new").notNull(), // 'new', 'contacted', 'scheduled', 'completed'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Digital Resources (Ebooks & Workbooks)
export const digitalResources = pgTable("digital_resources", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  type: text("type").notNull(), // 'ebook', 'workbook', 'guide'
  category: text("category"), // 'wellness', 'mindfulness', 'nutrition', etc.
  price: integer("price").notNull(), // Price in cents
  filename: varchar("filename", { length: 255 }).notNull(),
  originalName: varchar("original_name", { length: 255 }).notNull(),
  fileSize: integer("file_size").notNull(),
  mimeType: varchar("mime_type", { length: 100 }).notNull(),
  downloadCount: integer("download_count").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  previewPages: integer("preview_pages").default(0), // Number of free preview pages
  totalPages: integer("total_pages"),
  author: varchar("author", { length: 255 }).default("Dr. Sidra Bukhari").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Resource Purchases
export const resourcePurchases = pgTable("resource_purchases", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  resourceId: integer("resource_id").references(() => digitalResources.id).notNull(),
  paymentIntentId: varchar("payment_intent_id", { length: 255 }),
  amount: integer("amount").notNull(), // Amount paid in cents
  status: text("status").default("pending").notNull(), // 'pending', 'completed', 'failed'
  purchasedAt: timestamp("purchased_at").defaultNow().notNull(),
});

// Resource Downloads (for tracking)
export const resourceDownloads = pgTable("resource_downloads", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  resourceId: integer("resource_id").references(() => digitalResources.id).notNull(),
  downloadedAt: timestamp("downloaded_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  emailVerified: true,
  createdAt: true,
  updatedAt: true,
});

// Registration schema with password validation
export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string()
    .min(10, "Password must be at least 10 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().optional(),
});

// Login schema
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
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

// Digital Resources insert schemas
export const insertDigitalResourceSchema = createInsertSchema(digitalResources).omit({
  id: true,
  downloadCount: true,
  createdAt: true,
  updatedAt: true,
});

export const insertResourcePurchaseSchema = createInsertSchema(resourcePurchases).omit({
  id: true,
  purchasedAt: true,
});

export const insertResourceDownloadSchema = createInsertSchema(resourceDownloads).omit({
  id: true,
  downloadedAt: true,
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
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

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

// Digital Resources types
export type InsertDigitalResource = z.infer<typeof insertDigitalResourceSchema>;
export type DigitalResource = typeof digitalResources.$inferSelect;

export type InsertResourcePurchase = z.infer<typeof insertResourcePurchaseSchema>;
export type ResourcePurchase = typeof resourcePurchases.$inferSelect;

export type InsertResourceDownload = z.infer<typeof insertResourceDownloadSchema>;
export type ResourceDownload = typeof resourceDownloads.$inferSelect;

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

// Marketing Funnel Tables
export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  email: varchar("email").notNull().unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  source: varchar("source").notNull(), // landing_page, social_media, referral
  leadMagnet: varchar("lead_magnet"), // free_assessment, hormone_guide
  status: varchar("status").default("active"), // active, converted, unsubscribed
  leadScore: integer("lead_score").default(0), // 0-100 scoring system
  tags: text("tags").array().default([]),
  utmSource: varchar("utm_source"),
  utmMedium: varchar("utm_medium"),
  utmCampaign: varchar("utm_campaign"),
  referrerUrl: varchar("referrer_url"),
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  timeZone: varchar("time_zone"),
  createdAt: timestamp("created_at").defaultNow(),
  convertedAt: timestamp("converted_at"),
  lastEngaged: timestamp("last_engaged").defaultNow()
});

export const emailCampaigns = pgTable("email_campaigns", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  type: varchar("type").notNull(), // welcome_sequence, nurture, promotional
  subject: varchar("subject").notNull(),
  content: text("content").notNull(),
  sequence: integer("sequence").default(1),
  delayDays: integer("delay_days").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});

export const emailSends = pgTable("email_sends", {
  id: serial("id").primaryKey(),
  leadId: integer("lead_id").references(() => leads.id),
  campaignId: integer("campaign_id").references(() => emailCampaigns.id),
  sentAt: timestamp("sent_at").defaultNow(),
  opened: boolean("opened").default(false),
  clicked: boolean("clicked").default(false),
  openedAt: timestamp("opened_at"),
  clickedAt: timestamp("clicked_at")
});

export const conversionEvents = pgTable("conversion_events", {
  id: serial("id").primaryKey(),
  leadId: integer("lead_id").references(() => leads.id),
  eventType: varchar("event_type").notNull(), // assessment_completed, coaching_purchased, email_opened
  eventData: jsonb("event_data"),
  value: varchar("value"), // Store as string to avoid decimal issues
  createdAt: timestamp("created_at").defaultNow()
});

// A/B Testing Tables
export const abTests = pgTable("ab_tests", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  status: varchar("status").default("active"), // active, paused, completed
  trafficAllocation: integer("traffic_allocation").default(100), // percentage
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow()
});

export const abTestVariants = pgTable("ab_test_variants", {
  id: serial("id").primaryKey(),
  testId: integer("test_id").references(() => abTests.id),
  name: varchar("name").notNull(), // control, variant_a, variant_b
  trafficPercentage: integer("traffic_percentage").notNull(),
  config: jsonb("config"), // variant configuration
  createdAt: timestamp("created_at").defaultNow()
});

export const abTestAssignments = pgTable("ab_test_assignments", {
  id: serial("id").primaryKey(),
  testId: integer("test_id").references(() => abTests.id),
  variantId: integer("variant_id").references(() => abTestVariants.id),
  leadId: integer("lead_id").references(() => leads.id),
  sessionId: varchar("session_id"),
  assignedAt: timestamp("assigned_at").defaultNow()
});

// Behavioral Tracking
export const behaviorEvents = pgTable("behavior_events", {
  id: serial("id").primaryKey(),
  leadId: integer("lead_id").references(() => leads.id),
  sessionId: varchar("session_id"),
  eventType: varchar("event_type").notNull(), // page_view, button_click, form_submit, scroll_depth
  eventData: jsonb("event_data"),
  pageUrl: varchar("page_url"),
  timestamp: timestamp("timestamp").defaultNow()
});

// Lead Scoring Rules
export const leadScoringRules = pgTable("lead_scoring_rules", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  eventType: varchar("event_type").notNull(),
  scoreValue: integer("score_value").notNull(),
  conditions: jsonb("conditions"), // JSON conditions for rule application
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});

// Advanced Email Segmentation
export const emailSegments = pgTable("email_segments", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  conditions: jsonb("conditions"), // segmentation rules
  leadCount: integer("lead_count").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});

export const emailSegmentMembers = pgTable("email_segment_members", {
  id: serial("id").primaryKey(),
  segmentId: integer("segment_id").references(() => emailSegments.id),
  leadId: integer("lead_id").references(() => leads.id),
  addedAt: timestamp("added_at").defaultNow()
});

// Video storage table for future video content
export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  filename: varchar("filename").notNull(),
  originalName: varchar("original_name").notNull(),
  mimetype: varchar("mimetype").notNull(),
  size: integer("size").notNull(),
  duration: integer("duration"), // in seconds
  resolution: varchar("resolution"), // e.g., "1920x1080"
  url: varchar("url").notNull(),
  uploadedBy: varchar("uploaded_by").references(() => users.id, { onDelete: "set null" }),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
  isActive: boolean("is_active").default(true),
  title: varchar("title"),
  description: text("description"),
  tags: text("tags").array(),
  moduleId: varchar("module_id"), // For associating with coaching modules
  weekNumber: integer("week_number"), // For organizing by weeks
});

// Marketing Funnel Schema Definitions
export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
  convertedAt: true,
  lastEngaged: true
});

export const insertEmailCampaignSchema = createInsertSchema(emailCampaigns).omit({
  id: true,
  createdAt: true
});

export const insertEmailSendSchema = createInsertSchema(emailSends).omit({
  id: true,
  sentAt: true,
  openedAt: true,
  clickedAt: true
});

export const insertConversionEventSchema = createInsertSchema(conversionEvents).omit({
  id: true,
  createdAt: true
});

// Marketing Funnel Types
export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;

export type InsertEmailCampaign = z.infer<typeof insertEmailCampaignSchema>;
export type EmailCampaign = typeof emailCampaigns.$inferSelect;

export type InsertEmailSend = z.infer<typeof insertEmailSendSchema>;
export type EmailSend = typeof emailSends.$inferSelect;

export type InsertConversionEvent = z.infer<typeof insertConversionEventSchema>;
export type ConversionEvent = typeof conversionEvents.$inferSelect;

// Video Schema
export const insertVideoSchema = createInsertSchema(videos).omit({
  id: true,
  uploadedAt: true
});

// Video Types
export type InsertVideo = z.infer<typeof insertVideoSchema>;
export type Video = typeof videos.$inferSelect;

export const insertCoachingInquirySchema = createInsertSchema(coachingInquiries).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertCoachingInquiry = z.infer<typeof insertCoachingInquirySchema>;
export type CoachingInquiry = typeof coachingInquiries.$inferSelect;
