import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { DatabaseStorage } from "./database-storage";
import { setupAuth, isAuthenticated } from "./replitAuth";

const storage = new DatabaseStorage();

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-06-30.basil",
});
import { 
  insertHealthAssessmentSchema,
  insertJournalEntrySchema, 
  insertCoachingProgressSchema,
  insertGoalSchema,
  insertHabitSchema,
  insertMoodEntrySchema
} from "@shared/schema";
import { sendEmail, emailTemplates } from "./email";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize database storage and authentication
  const storage = new DatabaseStorage();
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      // Send welcome email for first-time users
      if (user && user.email && user.createdAt) {
        const createdDate = new Date(user.createdAt);
        const daysSinceCreation = (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
        
        // Send welcome email if user was created within the last day
        if (daysSinceCreation < 1) {
          const welcomeTemplate = emailTemplates.welcome(user.firstName || '');
          await sendEmail({
            to: user.email,
            from: 'welcome@thrivemidlife.com', // You'll need to verify this domain in SendGrid
            subject: welcomeTemplate.subject,
            html: welcomeTemplate.html,
            text: welcomeTemplate.text
          }).catch(error => {
            console.error('Failed to send welcome email:', error);
          });
        }
      }
      
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Health Assessments (keeping free access)
  app.get("/api/health-assessments/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      const assessments = await storage.getHealthAssessmentsByUser(userId);
      res.json(assessments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch health assessments" });
    }
  });

  app.post("/api/health-assessments", async (req, res) => {
    try {
      const validatedData = insertHealthAssessmentSchema.parse(req.body);
      const assessment = await storage.createHealthAssessment(validatedData);
      res.json(assessment);
    } catch (error) {
      res.status(400).json({ message: "Invalid health assessment data" });
    }
  });

  // Journal Entries
  app.get("/api/journal-entries", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const entries = await storage.getJournalEntriesByUser(userId);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch journal entries" });
    }
  });

  app.post("/api/journal-entries", async (req, res) => {
    try {
      const validatedData = insertJournalEntrySchema.parse(req.body);
      const entry = await storage.createJournalEntry(validatedData);
      res.json(entry);
    } catch (error) {
      res.status(400).json({ message: "Invalid journal entry data" });
    }
  });

  app.delete("/api/journal-entries/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteJournalEntry(id);
      res.json({ message: "Journal entry deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete journal entry" });
    }
  });

  // Coaching Progress
  app.get("/api/coaching-progress", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const progress = await storage.getCoachingProgressByUser(userId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch coaching progress" });
    }
  });

  app.post("/api/coaching-progress", async (req, res) => {
    try {
      const validatedData = insertCoachingProgressSchema.parse(req.body);
      const progress = await storage.createCoachingProgress(validatedData);
      res.json(progress);
    } catch (error) {
      res.status(400).json({ message: "Invalid coaching progress data" });
    }
  });

  app.put("/api/coaching-progress/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const progress = await storage.updateCoachingProgress(id, updates);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to update coaching progress" });
    }
  });

  // Goals
  app.get("/api/goals", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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
      const userId = req.user.claims.sub;
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
      const userId = req.user.claims.sub;
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

  // User Management
  app.get("/api/users/me", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Payment endpoint for coaching access
  app.post("/api/create-payment-intent", isAuthenticated, async (req: any, res) => {
    try {
      const { amount } = req.body;
      const userId = req.user.claims.sub;
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        metadata: {
          service: "coaching_plan",
          description: "ThriveMidlife 6-Week Mind-Body Reset Coaching Program",
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
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      // Verify payment intent with Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status === 'succeeded' && user && user.email) {
        // Send payment confirmation email
        const confirmationTemplate = emailTemplates.paymentConfirmation(
          user.firstName || '',
          amount
        );
        
        await sendEmail({
          to: user.email,
          from: 'payments@thrivemidlife.com',
          subject: confirmationTemplate.subject,
          html: confirmationTemplate.html,
          text: confirmationTemplate.text
        }).catch(error => {
          console.error('Failed to send payment confirmation email:', error);
        });
        
        res.json({ success: true, message: "Payment confirmed and email sent" });
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
        from: 'test@thrivemidlife.com',
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
      const userId = req.user.claims.sub;
      
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

  // SEO Routes - Sitemap and Robots.txt
  app.get('/sitemap.xml', (req, res) => {
    res.set('Content-Type', 'text/xml');
    res.send(generateSitemap());
  });

  app.get('/robots.txt', (req, res) => {
    res.set('Content-Type', 'text/plain');
    res.send(generateRobotsTxt());
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Import sitemap utilities
import { generateSitemap, generateRobotsTxt } from "./sitemap";
