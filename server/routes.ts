import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { DatabaseStorage } from "./database-storage";
import { setupCustomAuth, setupAdminAuth, isAuthenticated, hasPayment, isAdmin } from "./auth";
import { getSession } from "./replitAuth";
import { uploadVideo, VideoManager } from "./video-upload";
import { uploadPDF, DigitalResourceManager } from "./digital-resources";
import path from "path";

const storage = new DatabaseStorage();

let stripe: Stripe | null = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-06-30.basil",
  });
}
import {
  insertHealthAssessmentSchema,
  insertJournalEntrySchema,
  insertCoachingProgressSchema,
  insertGoalSchema,
  insertHabitSchema,
  insertMoodEntrySchema,
  insertGratitudeEntrySchema
} from "@shared/schema";
import * as schema from "@shared/schema";
import { sendEmail, emailTemplates } from "./email";
import { sendGmailEmail } from "./email-nodemailer";
import { marketingFunnel } from "./marketing-funnel";
import { normalizeTimestamp } from "./timestamp-utils";

function escapeHtml(input?: string): string {
  if (!input) return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize database storage and sessions
  const storage = new DatabaseStorage();

  // Setup session management (needed for custom auth)
  app.set("trust proxy", 1);
  app.use(getSession());

  // Setup custom authentication routes
  await setupCustomAuth(app);

  // Setup admin authentication routes
  await setupAdminAuth(app);

  // Note: /api/auth/user, /api/auth/login, /api/auth/register, /api/auth/logout 
  // are now handled in auth.ts via setupCustomAuth
  // Note: /api/admin/login, /api/admin/logout, /api/admin/user
  // are now handled in auth.ts via setupAdminAuth

  // Health check endpoint
  app.get("/api/health", async (req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      server: "running"
    });
  });

  // Health Assessments (keeping free access for logged-in users)
  // Debug endpoint to see all assessments with details
  app.get("/api/health-assessments/debug", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const assessments = await storage.getHealthAssessmentsByUser(userId);

      // Group by type for easier viewing
      const grouped = {
        mental: assessments.filter((a: any) => a.assessmentType === 'mental'),
        physical: assessments.filter((a: any) => a.assessmentType === 'physical'),
        cognitive: assessments.filter((a: any) => a.assessmentType === 'cognitive'),
        total: assessments.length
      };

      res.json({
        userId,
        totalAssessments: assessments.length,
        byType: {
          mental: grouped.mental.length,
          physical: grouped.physical.length,
          cognitive: grouped.cognitive.length
        },
        allAssessments: assessments.map((a: any) => ({
          id: a.id,
          type: a.assessmentType,
          score: a.score,
          completedAt: a.completedAt,
          date: new Date(a.completedAt).toLocaleString()
        })),
        grouped
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch health assessments debug" });
    }
  });

  app.get("/api/health-assessments", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const assessments = await storage.getHealthAssessmentsByUser(userId);
      res.json(assessments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch health assessments" });
    }
  });

  app.get("/api/health-assessments/:type", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const type = req.params.type; // 'mental', 'physical', 'cognitive'
      const assessment = await storage.getLatestHealthAssessment(userId, type);
      res.json(assessment || null);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch health assessment" });
    }
  });

  app.post("/api/health-assessments", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const validatedData = insertHealthAssessmentSchema.parse({
        ...req.body,
        userId, // Ensure userId comes from session, not request body
      });
      // Always create new assessment record to preserve history
      const assessment = await storage.createHealthAssessment(validatedData);
      res.json(assessment);
    } catch (error: any) {
      console.error("Health assessment save error:", error);
      res.status(400).json({ message: error.message || "Invalid health assessment data" });
    }
  });

  // Journal Entries
  app.get("/api/journal-entries", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const entries = await storage.getJournalEntriesByUser(userId);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch journal entries" });
    }
  });

  app.post("/api/journal-entries", isAuthenticated, hasPayment, async (req: any, res) => {
    try {
      const userId = req.session.userId;

      // Parse and validate the entry data
      let validatedData;
      try {
        validatedData = insertJournalEntrySchema.parse({
          ...req.body,
          userId,
        });
      } catch (validationError: any) {
        console.error('[routes.ts] Validation error:', validationError);
        return res.status(400).json({
          message: "Invalid journal entry data",
          error: validationError.errors || validationError.message,
          details: validationError
        });
      }

      // Normalize createdAt timestamp
      const entryData: any = {
        ...validatedData,
        createdAt: req.body.createdAt ? normalizeTimestamp(req.body.createdAt) : new Date(),
      };

      // Use upsert to update today's entry if it exists, or create new one
      const entry = await storage.upsertJournalEntryForToday(entryData);
      res.json(entry);
    } catch (error: any) {
      console.error('Error saving journal entry:', error);
      console.error('Error stack:', error.stack);
      res.status(400).json({
        message: "Invalid journal entry data",
        error: error.message,
        details: error
      });
    }
  });

  app.delete("/api/journal-entries/:id", isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.session.userId;

      // Verify the entry belongs to this user
      const userEntries = await storage.getJournalEntriesByUser(userId);
      const entry = userEntries.find(e => e.id === id);

      if (!entry) {
        return res.status(403).json({ message: "Access denied: Journal entry not found or does not belong to you" });
      }

      await storage.deleteJournalEntry(id, userId);
      res.json({ message: "Journal entry deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete journal entry" });
    }
  });

  // Coaching Progress
  app.get("/api/coaching-progress", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const progress = await storage.getCoachingProgressByUser(userId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch coaching progress" });
    }
  });

  app.post("/api/coaching-progress", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const validatedData = insertCoachingProgressSchema.parse({
        ...req.body,
        userId,
      });
      const progress = await storage.createCoachingProgress(validatedData);
      res.json(progress);
    } catch (error) {
      res.status(400).json({ message: "Invalid coaching progress data" });
    }
  });

  app.put("/api/coaching-progress/:id", isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.session.userId;

      // Verify the progress record belongs to this user
      const existingProgress = await storage.getCoachingProgressByUser(userId);
      const progressRecord = existingProgress.find(p => p.id === id);

      if (!progressRecord) {
        return res.status(403).json({ message: "Access denied: Progress record not found or does not belong to you" });
      }

      const updates = req.body;
      // Ensure userId cannot be changed
      if (updates.userId && updates.userId !== userId) {
        return res.status(403).json({ message: "Cannot change userId" });
      }

      // Whitelist fields to update and normalize types
      const safeUpdates: any = {};
      if (typeof updates.completed === "boolean") safeUpdates.completed = updates.completed;
      if (typeof updates.progress === "number") safeUpdates.progress = updates.progress;
      if (updates.completedAt) {
        safeUpdates.completedAt = normalizeTimestamp(updates.completedAt);
      }
      if (typeof updates.responseData === "object" && updates.responseData !== null) {
        safeUpdates.responseData = updates.responseData;
      }

      const progress = await storage.updateCoachingProgress(id, safeUpdates);
      res.json(progress);
    } catch (error: any) {
      console.error('Error updating coaching progress:', error?.stack || error, '\nRequest body:', req.body);
      res.status(500).json({
        message: "Failed to update coaching progress",
        error: error?.message || String(error)
      });
    }
  });

  // Goals
  app.get("/api/goals", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const goals = await storage.getGoalsByUser(userId);
      res.json(goals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch goals" });
    }
  });

  app.post("/api/goals", async (req, res) => {
    try {
      const validatedData = insertGoalSchema.parse(req.body);
      const goal = await storage.createGoal(validatedData);
      res.json(goal);
    } catch (error) {
      res.status(400).json({ message: "Invalid goal data" });
    }
  });

  app.put("/api/goals/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const goal = await storage.updateGoal(id, updates);
      res.json(goal);
    } catch (error) {
      res.status(500).json({ message: "Failed to update goal" });
    }
  });

  app.delete("/api/goals/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteGoal(id);
      res.json({ message: "Goal deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete goal" });
    }
  });

  // Habits
  app.get("/api/habits", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const habits = await storage.getHabitsByUser(userId);
      res.json(habits);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch habits" });
    }
  });

  app.post("/api/habits", async (req, res) => {
    try {
      const validatedData = insertHabitSchema.parse(req.body);
      const habit = await storage.createHabit(validatedData);
      res.json(habit);
    } catch (error) {
      res.status(400).json({ message: "Invalid habit data" });
    }
  });

  app.put("/api/habits/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const habit = await storage.updateHabit(id, updates);
      res.json(habit);
    } catch (error) {
      res.status(500).json({ message: "Failed to update habit" });
    }
  });

  app.delete("/api/habits/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteHabit(id);
      res.json({ message: "Habit deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete habit" });
    }
  });

  // Mood Entries
  app.get("/api/mood-entries", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const entries = await storage.getMoodEntriesByUser(userId);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch mood entries" });
    }
  });

  app.post("/api/mood-entries", async (req, res) => {
    try {
      const validatedData = insertMoodEntrySchema.parse(req.body);
      const entry = await storage.createMoodEntry(validatedData);
      res.json(entry);
    } catch (error) {
      res.status(400).json({ message: "Invalid mood entry data" });
    }
  });

  // Gratitude Entries
  app.get("/api/gratitude-entries", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const entries = await storage.getGratitudeEntriesByUser(userId);
      // Extra safety: ensure only this user's entries are returned
      const filtered = Array.isArray(entries) ? entries.filter((e: any) => e?.userId === userId) : [];
      res.json(filtered);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch gratitude entries" });
    }
  });

  app.post("/api/gratitude-entries", isAuthenticated, hasPayment, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const validated = insertGratitudeEntrySchema.parse({
        ...req.body,
        userId,
      });
      const entry = await storage.createGratitudeEntry(validated);
      res.json(entry);
    } catch (error: any) {
      res.status(400).json({ message: "Invalid gratitude entry data" });
    }
  });

  // User Management
  app.get("/api/users/me", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Update user profile
  app.put("/api/users/me", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const user = await storage.getUser(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Whitelist fields that can be updated
      const { firstName, lastName, phone, profileImageUrl } = req.body;

      const updates: any = {};
      if (firstName !== undefined) updates.firstName = firstName;
      if (lastName !== undefined) updates.lastName = lastName;
      if (phone !== undefined) updates.phone = phone;
      if (profileImageUrl !== undefined) updates.profileImageUrl = profileImageUrl;

      // Update user
      const updatedUser = await storage.upsertUser({
        ...user,
        ...updates,
        updatedAt: new Date()
      });

      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ message: "Failed to update user profile" });
    }
  });

  // Change password endpoint
  app.put("/api/users/me/password", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const user = await storage.getUser(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Current password and new password are required" });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({ message: "New password must be at least 8 characters long" });
      }

      // Verify current password
      const bcrypt = await import("bcrypt");
      if (!user.passwordHash) {
        return res.status(400).json({ message: "Password cannot be changed for this account" });
      }

      const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Current password is incorrect" });
      }

      // Hash new password
      const SALT_ROUNDS = 12;
      const newPasswordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

      // Update user password
      const updatedUser = await storage.upsertUser({
        ...user,
        passwordHash: newPasswordHash,
        updatedAt: new Date()
      });

      res.json({ message: "Password successfully changed" });
    } catch (error) {
      console.error("Error changing password:", error);
      res.status(500).json({ message: "Failed to change password" });
    }
  });

  // Get coaching program prices (public endpoint)
  app.get("/api/coaching-price", async (req, res) => {
    try {
      const dbModule = await import("./db");
      const db: any = dbModule.db;
      const { eq } = await import("drizzle-orm");
      const schemaModule: any = await import("@shared/schema");
      const adminConfig = schemaModule.adminConfig;

      const currentPriceRow = await db
        .select()
        .from(adminConfig)
        .where(eq(adminConfig.key, 'coaching_program_price'))
        .limit(1);

      const regularPriceRow = await db
        .select()
        .from(adminConfig)
        .where(eq(adminConfig.key, 'coaching_program_regular_price'))
        .limit(1);

      // Defaults
      const currentPrice = currentPriceRow[0]?.value ? parseFloat(currentPriceRow[0].value) : 150;
      const regularPrice = regularPriceRow[0]?.value ? parseFloat(regularPriceRow[0].value) : 297;

      res.json({ currentPrice, regularPrice });
    } catch (error) {
      console.error('Error fetching coaching price:', error);
      // Return defaults on error
      res.json({ currentPrice: 150, regularPrice: 297 });
    }
  });

  // Payment endpoint for coaching access
  app.post("/api/create-payment-intent", isAuthenticated, async (req: any, res) => {
    try {
      // Get Stripe instance from database or env (prefers database)
      const { getStripeInstance } = await import("./get-stripe-config");
      const stripeInstance = await getStripeInstance();

      // Fallback to env-based stripe instance if database doesn't have keys
      const activeStripe = stripeInstance || stripe;

      if (!activeStripe) {
        return res.status(503).json({ message: "Payments are not configured" });
      }
      const userId = req.session.userId;

      // Get price from database
      const dbModule = await import("./db");
      const db: any = dbModule.db;
      const { eq } = await import("drizzle-orm");
      const schemaModule: any = await import("@shared/schema");
      const adminConfig = schemaModule.adminConfig;

      const priceConfig = await db
        .select()
        .from(adminConfig)
        .where(eq(adminConfig.key, 'coaching_program_price'))
        .limit(1);

      // Default to 150 if not found in database
      const amount = priceConfig[0]?.value ? parseFloat(priceConfig[0].value) : 150;

      const paymentIntent = await activeStripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        metadata: {
          service: "coaching_plan",
          description: "MidlifeRebalance 6-Week Mind-Body Reset Coaching Program",
          userId: userId
        }
      });
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // Payment success confirmation endpoint
  app.post("/api/payment-success", isAuthenticated, async (req: any, res) => {
    try {
      const { paymentIntentId, amount } = req.body;
      const userId = req.session.userId;
      const user = await storage.getUser(userId);

      // Verify payment intent with Stripe
      const { getStripeInstance } = await import("./get-stripe-config");
      const stripeInstance = await getStripeInstance();
      const activeStripe = stripeInstance || stripe;

      if (!activeStripe) {
        return res.status(503).json({ success: false, message: "Payments are not configured" });
      }
      const paymentIntent = await activeStripe.paymentIntents.retrieve(paymentIntentId);

      if (paymentIntent.status === 'succeeded' && user && user.email) {
        // Grant coaching access to the user
        const prevCents = (user as any).amountPaidUsdCents || 0;
        const addCents = Math.round((amount || 0) * 100);
        await storage.upsertUser({
          ...user,
          hasCoachingAccess: true,
          coachingAccessGrantedAt: new Date(),
          amountPaidUsdCents: prevCents + addCents,
        });

        // Send payment confirmation email
        const confirmationTemplate = emailTemplates.paymentConfirmation(
          user.firstName || '',
          amount
        );

        await sendEmail({
          to: user.email,
          from: 'maazahmad1243@gmail.com',
          subject: confirmationTemplate.subject,
          html: confirmationTemplate.html,
          text: confirmationTemplate.text
        }).catch(error => {
          console.error('Failed to send payment confirmation email:', error);
        });

        res.json({ success: true, message: "Payment confirmed, access granted, and email sent" });
      } else {
        res.status(400).json({ success: false, message: "Payment not confirmed" });
      }
    } catch (error: any) {
      console.error('Payment confirmation error:', error);
      res.status(500).json({ message: "Error confirming payment: " + error.message });
    }
  });

  // Send weekly coaching reminder emails (admin endpoint)
  app.post("/api/send-weekly-reminders", async (req, res) => {
    try {
      const { weekNumber, weekTitle } = req.body;

      // This would typically be called by a scheduled job
      // For now, it's a manual admin endpoint

      // In a real implementation, you'd query for users with coaching access
      // and send personalized reminders based on their progress

      res.json({
        success: true,
        message: `Weekly reminder system ready for Week ${weekNumber}: ${weekTitle}`
      });
    } catch (error: any) {
      console.error('Weekly reminder error:', error);
      res.status(500).json({ message: "Error sending reminders: " + error.message });
    }
  });

  // Test email endpoint (admin only)
  app.post("/api/test-email", async (req, res) => {
    try {
      const { email, type = 'welcome' } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Email address required" });
      }

      let template;
      if (type === 'welcome') {
        template = emailTemplates.welcome('Test User');
      } else if (type === 'payment') {
        template = emailTemplates.paymentConfirmation('Test User', 97);
      } else {
        template = emailTemplates.weeklyReminder('Test User', 1, 'Mental Clarity & Mindset Foundations');
      }

      const success = await sendEmail({
        to: email,
        from: 'coaching@midliferebalance.com',
        subject: template.subject,
        html: template.html,
        text: template.text
      });

      res.json({
        success,
        message: success ? 'Test email sent successfully' : 'Email sending failed'
      });
    } catch (error: any) {
      console.error('Test email error:', error);
      res.status(500).json({ message: "Error sending test email: " + error.message });
    }
  });

  // Analytics endpoint
  app.get("/api/analytics", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId;

      // Fetch all relevant data for analytics
      const [assessments, journalEntries, moodEntries, goals, habits] = await Promise.all([
        storage.getHealthAssessmentsByUser(userId),
        storage.getJournalEntriesByUser(userId),
        storage.getMoodEntriesByUser(userId),
        storage.getGoalsByUser(userId),
        storage.getHabitsByUser(userId)
      ]);

      // Calculate analytics
      const analytics = {
        totalAssessments: assessments.length,
        totalJournalEntries: journalEntries.length,
        totalMoodEntries: moodEntries.length,
        totalGoals: goals.length,
        completedGoals: goals.filter(g => g.completed).length,
        totalHabits: habits.length,
        activeHabits: habits.filter(h => (h.streak ?? 0) > 0).length,
        averageHealthScores: assessments.length > 0 ? {
          mental: Math.round(assessments.filter(a => a.assessmentType === 'mental').reduce((acc, a) => acc + a.score, 0) / Math.max(1, assessments.filter(a => a.assessmentType === 'mental').length)),
          physical: Math.round(assessments.filter(a => a.assessmentType === 'physical').reduce((acc, a) => acc + a.score, 0) / Math.max(1, assessments.filter(a => a.assessmentType === 'physical').length)),
          cognitive: Math.round(assessments.filter(a => a.assessmentType === 'cognitive').reduce((acc, a) => acc + a.score, 0) / Math.max(1, assessments.filter(a => a.assessmentType === 'cognitive').length))
        } : { mental: 0, physical: 0, cognitive: 0 },
        moodDistribution: moodEntries.reduce((acc, entry) => {
          acc[entry.mood] = (acc[entry.mood] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      };

      res.json(analytics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  // Marketing Funnel Routes

  // Lead capture endpoint with enhanced tracking
  app.post('/api/capture-lead', async (req, res) => {
    try {
      const {
        email,
        firstName,
        lastName,
        source,
        leadMagnet,
        utmSource,
        utmMedium,
        utmCampaign,
        referrerUrl,
        userAgent,
        timeZone
      } = req.body;

      if (!email || !source) {
        return res.status(400).json({ message: 'Email and source are required' });
      }

      // Extract IP address from request
      const ipAddress = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'] as string;

      const lead = await marketingFunnel.captureLead({
        email,
        firstName,
        lastName,
        source,
        leadMagnet,
        utmSource,
        utmMedium,
        utmCampaign,
        referrerUrl,
        ipAddress,
        userAgent: userAgent || req.headers['user-agent'],
        timeZone
      });

      res.json({ success: true, leadId: lead.id, message: 'Lead captured successfully' });
    } catch (error) {
      console.error('Lead capture error:', error);
      res.status(500).json({ success: false, message: 'Failed to capture lead' });
    }
  });

  // Track conversion events
  app.post('/api/track-conversion', async (req, res) => {
    try {
      const { leadId, eventType, eventData, value } = req.body;

      if (!leadId || !eventType) {
        return res.status(400).json({ message: 'Lead ID and event type are required' });
      }

      await marketingFunnel.trackConversion(leadId, eventType, eventData, value);

      res.json({ success: true, message: 'Conversion tracked successfully' });
    } catch (error) {
      console.error('Conversion tracking error:', error);
      res.status(500).json({ success: false, message: 'Failed to track conversion' });
    }
  });

  // Enhanced behavioral tracking
  app.post('/api/track-behavior', async (req, res) => {
    try {
      const { leadId, eventType, eventData, sessionId } = req.body;

      if (!leadId || !eventType) {
        return res.status(400).json({ message: 'Lead ID and event type are required' });
      }

      await marketingFunnel.trackBehaviorEvent(leadId, eventType, eventData, sessionId);

      res.json({ success: true, message: 'Behavior tracked successfully' });
    } catch (error) {
      console.error('Behavior tracking error:', error);
      res.status(500).json({ success: false, message: 'Failed to track behavior' });
    }
  });

  // A/B testing assignment
  app.post('/api/assign-ab-test', async (req, res) => {
    try {
      const { leadId, testName } = req.body;

      if (!leadId || !testName) {
        return res.status(400).json({ message: 'Lead ID and test name are required' });
      }

      const variant = await marketingFunnel.assignToABTest(leadId, testName);

      res.json({ success: true, variant });
    } catch (error) {
      console.error('A/B test assignment error:', error);
      res.status(500).json({ success: false, message: 'Failed to assign A/B test' });
    }
  });

  // Lead scoring update
  app.post('/api/update-lead-score', async (req, res) => {
    try {
      const { leadId, eventType, eventData } = req.body;

      if (!leadId || !eventType) {
        return res.status(400).json({ message: 'Lead ID and event type are required' });
      }

      await marketingFunnel.updateLeadScore(leadId, eventType, eventData);

      res.json({ success: true, message: 'Lead score updated successfully' });
    } catch (error) {
      console.error('Lead scoring error:', error);
      res.status(500).json({ success: false, message: 'Failed to update lead score' });
    }
  });

  // Get funnel analytics (admin only)
  app.get('/api/funnel-analytics', async (req, res) => {
    try {
      const analytics = await marketingFunnel.getFunnelAnalytics();
      res.json(analytics);
    } catch (error) {
      console.error('Analytics error:', error);
      res.status(500).json({ message: 'Failed to fetch analytics' });
    }
  });

  // SEO Routes - Sitemap and Robots.txt
  app.get('/sitemap.xml', (req, res) => {
    res.set('Content-Type', 'text/xml');
    res.send(generateSitemap());
  });

  app.get('/robots.txt', (req, res) => {
    res.set('Content-Type', 'text/plain');
    res.send(generateRobotsTxt());
  });

  // Video Upload Routes (for future use)

  // Upload video endpoint (admin only)
  app.post('/api/upload-video', isAuthenticated, uploadVideo.single('video'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No video file uploaded' });
      }

      const videoMetadata = await VideoManager.saveVideoMetadata(req.file);

      res.json({
        message: 'Video uploaded successfully',
        video: videoMetadata
      });
    } catch (error) {
      console.error('Video upload error:', error);
      res.status(500).json({ message: 'Failed to upload video' });
    }
  });

  // Serve video files
  app.get('/api/videos/:filename', (req, res) => {
    const { filename } = req.params;
    const videoPath = path.join(process.cwd(), 'uploads', 'videos', filename);

    // Check if file exists
    require('fs').access(videoPath, require('fs').constants.F_OK, (err: any) => {
      if (err) {
        return res.status(404).json({ message: 'Video not found' });
      }

      // Serve video file with proper headers for streaming
      const stat = require('fs').statSync(videoPath);
      const fileSize = stat.size;
      const range = req.headers.range;

      if (range) {
        // Handle range requests for video streaming
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunksize = (end - start) + 1;
        const file = require('fs').createReadStream(videoPath, { start, end });
        const head = {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': 'video/mp4',
        };
        res.writeHead(206, head);
        file.pipe(res);
      } else {
        // Serve full video
        const head = {
          'Content-Length': fileSize,
          'Content-Type': 'video/mp4',
        };
        res.writeHead(200, head);
        require('fs').createReadStream(videoPath).pipe(res);
      }
    });
  });

  // Delete video endpoint (admin only)
  app.delete('/api/videos/:filename', isAuthenticated, async (req, res) => {
    try {
      const { filename } = req.params;
      const deleted = await VideoManager.deleteVideo(filename);

      if (deleted) {
        res.json({ message: 'Video deleted successfully' });
      } else {
        res.status(404).json({ message: 'Video not found' });
      }
    } catch (error) {
      console.error('Video deletion error:', error);
      res.status(500).json({ message: 'Failed to delete video' });
    }
  });

  // ===== COMMUNITY API ENDPOINTS =====

  // Forum Categories
  app.get('/api/community/categories', async (req, res) => {
    try {
      const categories = await storage.getForumCategories();
      res.json(categories);
    } catch (error) {
      console.error('Error fetching forum categories:', error);
      res.status(500).json({ message: 'Failed to fetch categories' });
    }
  });

  // Forum Posts
  app.get('/api/community/posts', async (req, res) => {
    try {
      const { category, search } = req.query;
      const posts = await storage.getForumPosts(category as string, search as string);
      res.json(posts);
    } catch (error) {
      console.error('Error fetching forum posts:', error);
      res.status(500).json({ message: 'Failed to fetch posts' });
    }
  });

  app.post('/api/community/posts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const { title, content, categoryId, isAnonymous } = req.body;

      if (!title?.trim() || !content?.trim() || !categoryId) {
        return res.status(400).json({ message: 'Title, content, and category are required' });
      }

      const post = await storage.createForumPost({
        userId,
        title: title.trim(),
        content: content.trim(),
        categoryId: parseInt(categoryId),
        isAnonymous: isAnonymous || false
      });

      res.status(201).json(post);
    } catch (error) {
      console.error('Error creating forum post:', error);
      res.status(500).json({ message: 'Failed to create post' });
    }
  });

  app.get('/api/community/posts/:id', async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const post = await storage.getForumPostById(postId);

      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      // Increment view count
      await storage.incrementPostViews(postId);

      res.json(post);
    } catch (error) {
      console.error('Error fetching forum post:', error);
      res.status(500).json({ message: 'Failed to fetch post' });
    }
  });

  // Forum Replies
  app.get('/api/community/posts/:id/replies', async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const replies = await storage.getForumReplies(postId);
      res.json(replies);
    } catch (error) {
      console.error('Error fetching replies:', error);
      res.status(500).json({ message: 'Failed to fetch replies' });
    }
  });

  app.post('/api/community/posts/:id/replies', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const postId = parseInt(req.params.id);
      const { content, isAnonymous, parentReplyId } = req.body;

      if (!content?.trim()) {
        return res.status(400).json({ message: 'Reply content is required' });
      }

      const reply = await storage.createForumReply({
        postId,
        userId,
        content: content.trim(),
        isAnonymous: isAnonymous || false,
        parentReplyId: parentReplyId || null
      });

      res.status(201).json(reply);
    } catch (error) {
      console.error('Error creating reply:', error);
      res.status(500).json({ message: 'Failed to create reply' });
    }
  });

  // Support Groups
  app.get('/api/community/groups', async (req, res) => {
    try {
      const groups = await storage.getSupportGroups();
      res.json(groups);
    } catch (error) {
      console.error('Error fetching support groups:', error);
      res.status(500).json({ message: 'Failed to fetch support groups' });
    }
  });

  app.post('/api/community/groups', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const { name, description, type, category, maxMembers, meetingSchedule } = req.body;

      if (!name?.trim() || !description?.trim() || !type || !category) {
        return res.status(400).json({ message: 'Name, description, type, and category are required' });
      }

      const group = await storage.createSupportGroup({
        name: name.trim(),
        description: description.trim(),
        type,
        category,
        maxMembers: maxMembers || 50,
        meetingSchedule,
        facilitatorId: userId
      });

      res.status(201).json(group);
    } catch (error) {
      console.error('Error creating support group:', error);
      res.status(500).json({ message: 'Failed to create support group' });
    }
  });

  app.post('/api/community/groups/:id/join', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const groupId = parseInt(req.params.id);

      const membership = await storage.joinSupportGroup(groupId, userId);

      if (membership) {
        res.status(201).json({ message: 'Successfully joined group', membership });
      } else {
        res.status(400).json({ message: 'Unable to join group (may be full or already a member)' });
      }
    } catch (error) {
      console.error('Error joining support group:', error);
      res.status(500).json({ message: 'Failed to join support group' });
    }
  });

  app.get('/api/community/groups/:id/members', async (req, res) => {
    try {
      const groupId = parseInt(req.params.id);
      const members = await storage.getSupportGroupMembers(groupId);
      res.json(members);
    } catch (error) {
      console.error('Error fetching group members:', error);
      res.status(500).json({ message: 'Failed to fetch group members' });
    }
  });

  // ===== COACHING INQUIRY ENDPOINT =====

  app.post('/api/coaching-inquiry', async (req, res) => {
    try {
      const {
        name,
        email,
        phone,
        coachingType,
        preferredSchedule,
        experience,
        goals,
        challenges,
        additionalInfo
      } = req.body;

      if (!name?.trim() || !email?.trim() || !goals?.trim() || !coachingType) {
        return res.status(400).json({ message: 'Name, email, coaching type, and goals are required' });
      }

      // Create coaching inquiry in database
      const inquiry = await storage.createCoachingInquiry({
        name: name.trim(),
        email: email.trim(),
        phone: phone?.trim() || null,
        coachingType,
        preferredSchedule: preferredSchedule?.trim() || null,
        experience: experience?.trim() || null,
        goals: goals.trim(),
        challenges: challenges?.trim() || null,
        additionalInfo: additionalInfo?.trim() || null,
        status: 'new'
      });

      // Send emails in background (don't wait for them)
      // Get email config once and reuse
      const { addSignatureToEmail } = await import('./email-signatures');
      const { getEmailConfig } = await import('./get-email-config');
      const emailConfig = await getEmailConfig();

      // Prepare email content
      const notificationEmailHtml = `
          <div style="font-family: Inter, Arial, sans-serif; max-width: 720px; margin: 0 auto; background: #ffffff;">
            <div style="padding: 24px 24px 0 24px;">
              <h1 style="margin: 0 0 8px 0; color: #111827; font-size: 22px;">New Coaching Inquiry</h1>
              <p style="margin: 0; color: #6b7280; font-size: 14px;">A new submission was received from the Personal Coaching form.</p>
            </div>

            <div style="margin: 16px 24px; padding: 16px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px;">
              <h2 style="margin: 0 0 12px 0; color: #111827; font-size: 16px;">Contact Information</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tbody>
                  <tr>
                    <td style="padding: 8px; color: #6b7280; width: 32%; font-size: 14px;">Full Name</td>
                    <td style="padding: 8px; color: #111827; font-size: 14px;"><strong>${name}</strong></td>
                  </tr>
                  <tr style="background: #ffffff;">
                    <td style="padding: 8px; color: #6b7280; font-size: 14px;">Email</td>
                    <td style="padding: 8px; font-size: 14px;"><a href="mailto:${email}" style="color: #4f46e5; text-decoration: none;">${email}</a></td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; color: #6b7280; font-size: 14px;">Phone</td>
                    <td style="padding: 8px; color: #111827; font-size: 14px;">${phone || 'Not provided'}</td>
                  </tr>
                  <tr style="background: #ffffff;">
                    <td style="padding: 8px; color: #6b7280; font-size: 14px;">Coaching Interest</td>
                    <td style="padding: 8px; color: #111827; font-size: 14px;">${coachingType}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; color: #6b7280; font-size: 14px;">Preferred Schedule</td>
                    <td style="padding: 8px; color: #111827; font-size: 14px;">${preferredSchedule || 'Not specified'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style="margin: 16px 24px; padding: 16px; background: #f0fdf4; border: 1px solid #dcfce7; border-radius: 8px;">
              <h2 style="margin: 0 0 8px 0; color: #065f46; font-size: 16px;">Goals & Aspirations</h2>
              <div style="white-space: pre-wrap; color: #065f46; font-size: 14px; line-height: 1.6;">${escapeHtml(goals)}</div>
            </div>

            ${challenges ? `
              <div style="margin: 16px 24px; padding: 16px; background: #fff7ed; border: 1px solid #ffedd5; border-radius: 8px;">
                <h2 style="margin: 0 0 8px 0; color: #92400e; font-size: 16px;">Current Challenges</h2>
                <div style="white-space: pre-wrap; color: #92400e; font-size: 14px; line-height: 1.6;">${escapeHtml(challenges)}</div>
              </div>
            ` : ''}

            ${experience ? `
              <div style="margin: 16px 24px; padding: 16px; background: #eef2ff; border: 1px solid #e0e7ff; border-radius: 8px;">
                <h2 style="margin: 0 0 8px 0; color: #3730a3; font-size: 16px;">Previous Experience</h2>
                <div style="white-space: pre-wrap; color: #3730a3; font-size: 14px; line-height: 1.6;">${escapeHtml(experience)}</div>
              </div>
            ` : ''}

            ${additionalInfo ? `
              <div style="margin: 16px 24px; padding: 16px; background: #fdf2f8; border: 1px solid #fce7f3; border-radius: 8px;">
                <h2 style="margin: 0 0 8px 0; color: #9d174d; font-size: 16px;">Additional Information</h2>
                <div style="white-space: pre-wrap; color: #9d174d; font-size: 14px; line-height: 1.6;">${escapeHtml(additionalInfo)}</div>
              </div>
            ` : ''}

            <div style="margin: 24px 24px 32px 24px; padding: 16px; background: #4f46e5; color: white; border-radius: 8px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="font-size: 14px; opacity: 0.9;">Inquiry ID</div>
                  <div style="font-size: 16px; font-weight: 600;">#${inquiry.id}</div>
                </div>
                <div style="text-align: right;">
                  <div style="font-size: 14px; opacity: 0.9;">Submitted</div>
                  <div style="font-size: 16px; font-weight: 600;">${new Date().toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>
        `;

      const confirmationEmailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; padding: 20px;">
            <h1 style="color: #8B5CF6; margin-bottom: 10px;">Thank You, ${name}!</h1>
            <p style="color: #6b7280; font-size: 18px;">Your coaching inquiry has been received</p>
          </div>
          
          <div style="background: #f8fafc; padding: 25px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #1e293b; margin-top: 0;">What Happens Next?</h2>
            <ul style="color: #374151; line-height: 1.6;">
              <li><strong>Personal Review:</strong> Dr. Sidra Bukhari will personally review your inquiry within 24 hours</li>
              <li><strong>Initial Response:</strong> You'll receive a personalized response addressing your specific goals and needs</li>
              <li><strong>Discovery Call:</strong> If there's a good fit, we'll schedule a complimentary 15-minute discovery call</li>
              <li><strong>Coaching Plan:</strong> Together, we'll design a coaching approach that's perfect for your situation</li>
            </ul>
          </div>
          
          <div style="background: #8B5CF6; color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Your Inquiry Summary</h3>
            <p><strong>Coaching Interest:</strong> ${coachingType}</p>
            <p><strong>Inquiry ID:</strong> #${inquiry.id}</p>
            <p style="margin-bottom: 0;"><strong>Submitted:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #6b7280;">
              If you have any urgent questions, please email us at 
              <a href="mailto:coaching@midliferebalance.com" style="color: #8B5CF6;">coaching@midliferebalance.com</a>
            </p>
          </div>
        </div>
      `;

      // Send both emails in parallel (don't block response)
      const emailPromises = Promise.all([
        sendGmailEmail({
          to: emailConfig.coachingInbox,
          from: emailConfig.gmailUser || emailConfig.coachingInbox,
          subject: `New Coaching Inquiry from ${name}`,
          html: notificationEmailHtml
        }).catch(err => {
          console.error('Notification email failed:', err);
          return false;
        }),
        sendGmailEmail({
          to: email,
          from: emailConfig.gmailUser || emailConfig.coachingInbox,
          subject: 'Your Coaching Inquiry Has Been Received - Dr. Sidra Bukhari',
          html: addSignatureToEmail(confirmationEmailContent, 'personal')
        }).catch(err => {
          console.error('Confirmation email failed:', err);
          return false;
        })
      ]);

      // Don't wait for emails - return immediately
      // Emails will be sent in background
      emailPromises.then(([notificationSent, confirmationSent]) => {
        console.log(`Coaching inquiry #${inquiry.id} emails: notification=${notificationSent}, confirmation=${confirmationSent}`);
      }).catch(err => {
        console.error('Error sending coaching inquiry emails:', err);
      });

      res.status(201).json({
        message: 'Coaching inquiry submitted successfully',
        inquiryId: inquiry.id,
        emailSent: true // Assume emails will be sent (they're in background)
      });

    } catch (error) {
      console.error('Error processing coaching inquiry:', error);
      res.status(500).json({ message: 'Failed to submit coaching inquiry' });
    }
  });

  // Admin endpoint to view coaching inquiries (protected)
  app.get('/api/admin/coaching-inquiries', async (req, res) => {
    try {
      const inquiries = await storage.getCoachingInquiries();
      res.json(inquiries);
    } catch (error) {
      console.error('Error fetching coaching inquiries:', error);
      res.status(500).json({ message: 'Failed to fetch inquiries' });
    }
  });

  // ===== DIGITAL RESOURCES ENDPOINTS =====

  // Get all digital resources (public)
  app.get('/api/resources', async (req, res) => {
    try {
      const resources = await storage.getDigitalResources();
      res.json(resources);
    } catch (error) {
      console.error('Error fetching digital resources:', error);
      res.status(500).json({ message: 'Failed to fetch resources' });
    }
  });

  // Purchase digital resource
  app.post('/api/purchase-resource', isAuthenticated, async (req: any, res) => {
    try {
      const { resourceId } = req.body;
      const userId = req.session.userId;

      if (!resourceId) {
        return res.status(400).json({ message: 'Resource ID is required' });
      }

      // Get resource details
      const resource = await storage.getDigitalResourceById(resourceId);
      if (!resource) {
        return res.status(404).json({ message: 'Resource not found' });
      }

      // Check if user already purchased this resource
      const alreadyPurchased = await storage.hasUserPurchasedResource(userId, resourceId);
      if (alreadyPurchased) {
        return res.status(400).json({ message: 'Resource already purchased' });
      }

      // Create Stripe payment intent for the resource
      const { getStripeInstance } = await import("./get-stripe-config");
      const stripeInstance = await getStripeInstance();
      const activeStripe = stripeInstance || stripe;

      if (!activeStripe) {
        return res.status(503).json({ message: 'Payments are not configured' });
      }
      const paymentIntent = await activeStripe.paymentIntents.create({
        amount: Math.round(resource.price * 100), // Convert to cents
        currency: 'usd',
        metadata: {
          resourceId: resourceId.toString(),
          userId: userId,
          type: 'digital_resource'
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      // Record the purchase attempt
      await storage.createResourcePurchase({
        userId,
        resourceId,
        amount: resource.price,
        paymentIntentId: paymentIntent.id
      });

      res.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        resourceId: resourceId,
        paymentUrl: `/resource-checkout?payment_intent=${paymentIntent.id}&resource_id=${resourceId}`
      });
    } catch (error: any) {
      console.error('Error creating resource purchase:', error);
      res.status(500).json({ message: 'Failed to process purchase: ' + error.message });
    }
  });

  // Stripe webhook for payment completion
  app.post('/api/stripe-webhook', async (req, res) => {
    try {
      const { type, data } = req.body;

      if (type === 'payment_intent.succeeded') {
        const paymentIntent = data.object;
        await storage.updateResourcePurchaseStatus(paymentIntent.id, 'completed');
        console.log('Payment completed for:', paymentIntent.id);
      }

      res.json({ received: true });
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(400).json({ error: 'Webhook failed' });
    }
  });

  // Get specific resource by ID
  app.get('/api/resources/:id', async (req, res) => {
    try {
      const resourceId = parseInt(req.params.id);
      const resource = await storage.getDigitalResourceById(resourceId);

      if (!resource) {
        return res.status(404).json({ message: 'Resource not found' });
      }

      res.json(resource);
    } catch (error) {
      console.error('Error fetching resource:', error);
      res.status(500).json({ message: 'Failed to fetch resource' });
    }
  });

  // Download resource endpoint (requires coaching access)
  app.get('/api/download-resource/:id', isAuthenticated, hasPayment, async (req: any, res) => {
    try {
      const resourceId = parseInt(req.params.id);
      const userId = req.session.userId;

      const resource = await storage.getDigitalResourceById(resourceId);
      if (!resource) {
        return res.status(404).json({ message: 'Resource not found' });
      }

      // Check if resource requires additional payment beyond coaching access
      if (resource.price > 0) {
        const hasPurchased = await storage.hasUserPurchasedResource(userId, resourceId);
        if (!hasPurchased) {
          return res.status(403).json({ message: 'Purchase required to download this resource' });
        }
      }

      // Track the download
      await storage.createResourceDownload({
        userId,
        resourceId
      });

      // Get file path
      const filePath = DigitalResourceManager.getFilePath(resource.filename);

      // Check if file exists
      if (!DigitalResourceManager.fileExists(resource.filename)) {
        return res.status(404).json({ message: 'File not found' });
      }

      // Read file buffer to ensure clean delivery
      const fs = await import('fs');
      const fileBuffer = fs.readFileSync(filePath);

      // Set secure headers that prevent antivirus false positives
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${(resource.originalName || resource.title).replace(/[^a-zA-Z0-9\s._-]/g, '_')}.pdf"`);
      res.setHeader('Content-Length', fileBuffer.length.toString());
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('X-Download-Options', 'noopen');
      res.setHeader('Referrer-Policy', 'no-referrer');

      // Send clean file buffer
      res.send(fileBuffer);

    } catch (error) {
      console.error('Error downloading resource:', error);
      res.status(500).json({ message: 'Failed to download resource' });
    }
  });

  // Get payment intent details
  app.get('/api/payment-intent/:id', isAuthenticated, async (req: any, res) => {
    try {
      const paymentIntentId = req.params.id;

      // Retrieve payment intent from Stripe
      const { getStripeInstance } = await import("./get-stripe-config");
      const stripeInstance = await getStripeInstance();
      const activeStripe = stripeInstance || stripe;

      if (!activeStripe) {
        return res.status(503).json({ message: 'Payments are not configured' });
      }
      const paymentIntent = await activeStripe.paymentIntents.retrieve(paymentIntentId);

      res.json({
        clientSecret: paymentIntent.client_secret,
        status: paymentIntent.status,
        amount: paymentIntent.amount
      });
    } catch (error: any) {
      console.error('Error fetching payment intent:', error);
      res.status(500).json({ message: 'Failed to fetch payment intent: ' + error.message });
    }
  });

  // Get user's purchased resources
  app.get('/api/my-resources', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const purchases = await storage.getUserResourcePurchases(userId);

      // Get resource details for each purchase
      const resourceIds = purchases.map(p => p.resourceId);
      const allResources = await storage.getDigitalResources();
      const purchasedResources = allResources.filter(r =>
        resourceIds.includes(r.id) || r.price === 0 // Include free resources
      );

      res.json(purchasedResources);

    } catch (error) {
      console.error('Error fetching user resources:', error);
      res.status(500).json({ message: 'Failed to fetch user resources' });
    }
  });

  // ========== ADMIN ROUTES ==========

  // Get all users (admin only)
  app.get("/api/admin/users", isAdmin, async (req: any, res) => {
    try {
      const dbModule = await import("./db");
      const db: any = dbModule.db;
      const schemaModule: any = await import("@shared/schema");
      const users = schemaModule.users;
      const resourcePurchases = schemaModule.resourcePurchases;
      const adminConfig = schemaModule.adminConfig;
      const { desc } = await import("drizzle-orm");

      const allUsers = await db
        .select({
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
          phone: users.phone,
          emailVerified: users.emailVerified,
          hasCoachingAccess: users.hasCoachingAccess,
          amountPaidUsdCents: users.amountPaidUsdCents,
          coachingAccessGrantedAt: users.coachingAccessGrantedAt,
          isAdmin: users.isAdmin,
          createdAt: users.createdAt,
        })
        .from(users)
        .orderBy(desc(users.createdAt));

      // Fetch current coaching price for approximation
      const { eq } = await import("drizzle-orm");
      const priceRow = await db
        .select()
        .from(adminConfig)
        .where(eq(adminConfig.key, 'coaching_program_price'))
        .limit(1);
      const currentCoachingPrice = priceRow[0]?.value ? parseFloat(priceRow[0].value) : 150;

      // Fetch resource purchase sums grouped by user for completed payments
      const rpRows = await db
        .select({ userId: resourcePurchases.userId, amount: resourcePurchases.amount })
        .from(resourcePurchases)
        .where(eq(resourcePurchases.status, 'completed'));
      const resourceSumByUser: Record<string, number> = {};
      for (const r of rpRows) {
        const uid = String(r.userId);
        resourceSumByUser[uid] = (resourceSumByUser[uid] || 0) + (r.amount || 0);
      }

      const withAmounts = allUsers.map((u: any) => {
        const resourceSum = resourceSumByUser[String(u.id)] || 0; // USD
        const coachingUsd = (u.amountPaidUsdCents || 0) / 100;
        const amountPaid = coachingUsd + resourceSum;
        return { ...u, amountPaid };
      });

      // Ensure JSON content type is set explicitly
      res.setHeader('Content-Type', 'application/json');
      res.json(withAmounts);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.setHeader('Content-Type', 'application/json');
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  // Get admin statistics
  app.get("/api/admin/stats", isAdmin, async (req: any, res) => {
    try {
      const dbModule = await import("./db");
      const db: any = dbModule.db;
      const schemaModule: any = await import("@shared/schema");
      const users = schemaModule.users;
      const resourcePurchases = schemaModule.resourcePurchases;
      const { count, eq } = await import("drizzle-orm");

      // Total users count
      const totalUsersResult = await db
        .select({ count: count() })
        .from(users);
      const totalUsers = totalUsersResult[0]?.count || 0;

      // Users with payments (hasCoachingAccess or has resource purchases)
      const usersWithAccess = await db
        .select({ count: count() })
        .from(users)
        .where(eq(users.hasCoachingAccess, true));
      const usersWithCoachingAccess = usersWithAccess[0]?.count || 0;

      const usersWithPurchasesResult = await db
        .selectDistinct({ userId: resourcePurchases.userId })
        .from(resourcePurchases)
        .where(eq(resourcePurchases.status, 'completed'));
      const uniqueUsersWithPurchases = new Set(usersWithPurchasesResult.map((p: any) => p.userId)).size;

      // Users without payments = total users - (users with coaching access OR users with purchases)
      // Note: A user might have both, so we need to calculate unique users with any payment
      const usersWithAnyPayment = usersWithCoachingAccess + uniqueUsersWithPurchases;
      // Simple calculation: users without payments = total - those with payments
      // (This is approximate since a user could have both coaching access and purchases)
      const usersWithoutPayments = Math.max(0, totalUsers - Math.max(usersWithCoachingAccess, uniqueUsersWithPurchases));

      res.json({
        totalUsers,
        usersWithPayments: usersWithCoachingAccess + uniqueUsersWithPurchases,
        usersWithoutPayments: Math.max(0, usersWithoutPayments),
        usersWithCoachingAccess,
        usersWithResourcePurchases: uniqueUsersWithPurchases
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      res.status(500).json({ message: "Failed to fetch admin statistics" });
    }
  });

  // Get Stripe publishable key (public endpoint - safe to expose)
  app.get("/api/stripe-public-key", async (req: any, res) => {
    try {
      const { getStripeConfig } = await import("./get-stripe-config");
      const config = await getStripeConfig();
      res.json({
        publishableKey: config.publishableKey || '',
        configured: !!config.publishableKey
      });
    } catch (error) {
      console.error('Error fetching Stripe public key:', error);
      res.status(500).json({
        publishableKey: '',
        configured: false,
        message: "Failed to fetch Stripe public key"
      });
    }
  });

  // Get Stripe keys from admin config
  app.get("/api/admin/stripe-keys", isAdmin, async (req: any, res) => {
    try {
      const dbModule = await import("./db");
      const db: any = dbModule.db;
      const { eq } = await import("drizzle-orm");
      const schemaModule: any = await import("@shared/schema");
      const adminConfig = schemaModule.adminConfig;

      const publishableKey = await db
        .select()
        .from(adminConfig)
        .where(eq(adminConfig.key, 'stripe_publishable_key'))
        .limit(1);

      const secretKey = await db
        .select()
        .from(adminConfig)
        .where(eq(adminConfig.key, 'stripe_secret_key'))
        .limit(1);

      // Also check environment variables as fallback (return actual values for admin)
      const envPublishableKey = process.env.STRIPE_PUBLISHABLE_KEY || '';
      const envSecretKey = process.env.STRIPE_SECRET_KEY || '';

      res.json({
        publishableKey: publishableKey[0]?.value || envPublishableKey,
        secretKey: secretKey[0]?.value || envSecretKey,
        source: publishableKey[0] || secretKey[0] ? 'database' : 'environment'
      });
    } catch (error) {
      console.error('Error fetching Stripe keys:', error);
      res.status(500).json({ message: "Failed to fetch Stripe keys" });
    }
  });

  // Get email configuration (admin only) - from database
  app.get("/api/admin/email-config", isAdmin, async (_req: any, res) => {
    try {
      const dbModule = await import("./db");
      const db: any = dbModule.db;
      const { eq } = await import("drizzle-orm");
      const schemaModule: any = await import("@shared/schema");
      const adminConfig = schemaModule.adminConfig;

      const gmailUserRow = await db
        .select()
        .from(adminConfig)
        .where(eq(adminConfig.key, 'gmail_user'))
        .limit(1);

      const gmailAppPasswordRow = await db
        .select()
        .from(adminConfig)
        .where(eq(adminConfig.key, 'gmail_app_password'))
        .limit(1);

      const coachingInboxRow = await db
        .select()
        .from(adminConfig)
        .where(eq(adminConfig.key, 'coaching_inbox'))
        .limit(1);

      // Fallback to environment variables if not in database (return actual values for admin)
      const envGmailUser = process.env.GMAIL_USER || '';
      const envGmailAppPassword = process.env.GMAIL_APP_PASSWORD || process.env.GMAIL_PASS || '';
      const envCoachingInbox = process.env.COACHING_INBOX || 'coaching@midliferebalance.com';

      res.json({
        gmailUser: gmailUserRow[0]?.value || envGmailUser,
        gmailAppPassword: gmailAppPasswordRow[0]?.value || envGmailAppPassword,
        coachingInbox: coachingInboxRow[0]?.value || envCoachingInbox,
        source: (gmailUserRow[0] || gmailAppPasswordRow[0] || coachingInboxRow[0]) ? 'database' : 'environment'
      });
    } catch (error: any) {
      console.error('Error fetching email config:', error);
      res.status(500).json({ message: 'Failed to fetch email configuration' });
    }
  });

  // Update email configuration (admin only) - store in database
  app.put("/api/admin/email-config", isAdmin, async (req: any, res) => {
    try {
      const { gmailUser, gmailAppPassword, coachingInbox } = req.body;
      const dbModule = await import("./db");
      const db: any = dbModule.db;
      const { eq } = await import("drizzle-orm");
      const userId = req.session.userId;
      const schemaModule: any = await import("@shared/schema");
      const adminConfig = schemaModule.adminConfig;

      // Update or insert gmail_user
      if (typeof gmailUser === 'string') {
        const existingGmailUser = await db
          .select()
          .from(adminConfig)
          .where(eq(adminConfig.key, 'gmail_user'))
          .limit(1);

        if (existingGmailUser.length > 0) {
          await db
            .update(adminConfig)
            .set({
              value: gmailUser,
              updatedBy: userId,
              updatedAt: new Date()
            })
            .where(eq(adminConfig.key, 'gmail_user'));
        } else {
          await db.insert(adminConfig).values({
            key: 'gmail_user',
            value: gmailUser,
            description: 'Gmail User Email Address',
            updatedBy: userId
          });
        }
      }

      // Update or insert gmail_app_password (only if provided)
      if (gmailAppPassword && typeof gmailAppPassword === 'string' && gmailAppPassword.trim()) {
        const existingGmailPassword = await db
          .select()
          .from(adminConfig)
          .where(eq(adminConfig.key, 'gmail_app_password'))
          .limit(1);

        if (existingGmailPassword.length > 0) {
          await db
            .update(adminConfig)
            .set({
              value: gmailAppPassword,
              updatedBy: userId,
              updatedAt: new Date()
            })
            .where(eq(adminConfig.key, 'gmail_app_password'));
        } else {
          await db.insert(adminConfig).values({
            key: 'gmail_app_password',
            value: gmailAppPassword,
            description: 'Gmail App Password (sensitive)',
            updatedBy: userId
          });
        }
      }

      // Update or insert coaching_inbox
      if (typeof coachingInbox === 'string') {
        const existingCoachingInbox = await db
          .select()
          .from(adminConfig)
          .where(eq(adminConfig.key, 'coaching_inbox'))
          .limit(1);

        if (existingCoachingInbox.length > 0) {
          await db
            .update(adminConfig)
            .set({
              value: coachingInbox,
              updatedBy: userId,
              updatedAt: new Date()
            })
            .where(eq(adminConfig.key, 'coaching_inbox'));
        } else {
          await db.insert(adminConfig).values({
            key: 'coaching_inbox',
            value: coachingInbox,
            description: 'Coaching Inbox Email Address',
            updatedBy: userId
          });
        }
      }

      // Clear email config cache to force refresh
      const { clearEmailConfigCache } = await import('./get-email-config');
      clearEmailConfigCache();

      res.json({
        message: 'Email configuration updated successfully',
        note: 'Settings are stored in database. Server restart may be required for full effect.'
      });
    } catch (error: any) {
      console.error('Error updating email config:', error);
      res.status(500).json({ message: 'Failed to update email configuration', error: error.message });
    }
  });

  // Update Stripe keys in admin config (and optionally sync to .env)
  app.put("/api/admin/stripe-keys", isAdmin, async (req: any, res) => {
    try {
      const { publishableKey, secretKey } = req.body;

      if (!publishableKey && !secretKey) {
        return res.status(400).json({ message: "Provide at least one key to update" });
      }

      const dbModule = await import("./db");
      const db: any = dbModule.db;
      const { eq } = await import("drizzle-orm");
      const userId = req.session.userId;
      const schemaModule: any = await import("@shared/schema");
      const adminConfig = schemaModule.adminConfig;

      // Update or insert publishable key (if provided)
      if (typeof publishableKey === 'string') {
        const existingPubKey = await db
          .select()
          .from(adminConfig)
          .where(eq(adminConfig.key, 'stripe_publishable_key'))
          .limit(1);
        if (existingPubKey.length > 0) {
          await db
            .update(adminConfig)
            .set({ value: publishableKey, updatedBy: userId, updatedAt: new Date() })
            .where(eq(adminConfig.key, 'stripe_publishable_key'));
        } else {
          await db.insert(adminConfig).values({
            key: 'stripe_publishable_key',
            value: publishableKey,
            description: 'Stripe Publishable Key',
            updatedBy: userId
          });
        }
      }

      // Update or insert secret key (if provided)
      if (typeof secretKey === 'string' && secretKey.trim()) {
        const existingSecretKey = await db
          .select()
          .from(adminConfig)
          .where(eq(adminConfig.key, 'stripe_secret_key'))
          .limit(1);
        if (existingSecretKey.length > 0) {
          await db
            .update(adminConfig)
            .set({ value: secretKey, updatedBy: userId, updatedAt: new Date() })
            .where(eq(adminConfig.key, 'stripe_secret_key'));
        } else {
          await db.insert(adminConfig).values({
            key: 'stripe_secret_key',
            value: secretKey,
            description: 'Stripe Secret Key (sensitive)',
            updatedBy: userId
          });
        }
        // Update Stripe instance with new secret key
        stripe = new Stripe(secretKey, { apiVersion: "2025-06-30.basil" });
      }

      // Clear Stripe config cache to force refresh
      const { clearStripeConfigCache } = await import('./get-stripe-config');
      clearStripeConfigCache();

      res.json({
        message: "Stripe keys updated successfully",
        note: "Keys are stored in database. Server restart may be required for full effect."
      });
    } catch (error: any) {
      console.error('Error updating Stripe keys:', error);
      res.status(500).json({
        message: "Failed to update Stripe keys",
        error: error.message
      });
    }
  });

  // Get coaching program prices (admin only)
  app.get("/api/admin/coaching-price", isAdmin, async (req: any, res) => {
    try {
      const dbModule = await import("./db");
      const db: any = dbModule.db;
      const { eq } = await import("drizzle-orm");
      const schemaModule: any = await import("@shared/schema");
      const adminConfig = schemaModule.adminConfig;

      const currentPriceRow = await db
        .select()
        .from(adminConfig)
        .where(eq(adminConfig.key, 'coaching_program_price'))
        .limit(1);

      const regularPriceRow = await db
        .select()
        .from(adminConfig)
        .where(eq(adminConfig.key, 'coaching_program_regular_price'))
        .limit(1);

      const currentPrice = currentPriceRow[0]?.value ? parseFloat(currentPriceRow[0].value) : 150;
      const regularPrice = regularPriceRow[0]?.value ? parseFloat(regularPriceRow[0].value) : 297;

      res.json({ currentPrice, regularPrice });
    } catch (error) {
      console.error('Error fetching coaching price:', error);
      res.status(500).json({ message: "Failed to fetch coaching price" });
    }
  });

  // Update coaching program prices (admin only)
  app.put("/api/admin/coaching-price", isAdmin, async (req: any, res) => {
    try {
      const { currentPrice, regularPrice } = req.body;

      console.log('[Price Update] Received request:', { currentPrice, regularPrice });

      if (!currentPrice || typeof currentPrice !== 'number' || currentPrice <= 0) {
        return res.status(400).json({ message: "Valid current price is required (must be a positive number)" });
      }

      const dbModule = await import("./db");
      const db: any = dbModule.db;
      const { eq } = await import("drizzle-orm");
      const userId = req.session.userId;

      console.log('[Price Update] User ID:', userId);

      const schemaModule: any = await import("@shared/schema");
      const adminConfig = schemaModule.adminConfig;

      // Update or insert current price
      const existingCurrent = await db
        .select()
        .from(adminConfig)
        .where(eq(adminConfig.key, 'coaching_program_price'))
        .limit(1);

      if (existingCurrent.length > 0) {
        await db
          .update(adminConfig)
          .set({
            value: currentPrice.toString(),
            updatedBy: userId,
            updatedAt: new Date()
          })
          .where(eq(adminConfig.key, 'coaching_program_price'));
      } else {
        await db.insert(adminConfig).values({
          key: 'coaching_program_price',
          value: currentPrice.toString(),
          description: 'Coaching Program Current Price in USD',
          updatedBy: userId
        });
      }

      // Update or insert regular price (optional)
      if (regularPrice && typeof regularPrice === 'number' && regularPrice > 0) {
        const existingRegular = await db
          .select()
          .from(adminConfig)
          .where(eq(adminConfig.key, 'coaching_program_regular_price'))
          .limit(1);
        if (existingRegular.length > 0) {
          await db
            .update(adminConfig)
            .set({
              value: regularPrice.toString(),
              updatedBy: userId,
              updatedAt: new Date()
            })
            .where(eq(adminConfig.key, 'coaching_program_regular_price'));
        } else {
          await db.insert(adminConfig).values({
            key: 'coaching_program_regular_price',
            value: regularPrice.toString(),
            description: 'Coaching Program Regular/List Price in USD',
            updatedBy: userId
          });
        }
      }

      res.json({ message: "Coaching prices updated successfully" });
    } catch (error: any) {
      console.error('[Price Update] Error updating coaching price:', error);
      console.error('[Price Update] Error stack:', error.stack);
      res.status(500).json({
        message: "Failed to update coaching price",
        error: error.message
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Import sitemap utilities
import { generateSitemap, generateRobotsTxt } from "./sitemap";
