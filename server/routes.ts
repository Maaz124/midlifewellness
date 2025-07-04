import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";

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

export async function registerRoutes(app: Express): Promise<Server> {
  // Health Assessments
  app.get("/api/health-assessments/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
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
  app.get("/api/journal-entries/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
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
  app.get("/api/coaching-progress/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
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
  app.get("/api/goals/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
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
  app.get("/api/habits/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
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
  app.get("/api/mood-entries/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
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
  app.get("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Payment endpoint for coaching access
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount } = req.body;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        metadata: {
          service: "coaching_plan",
          description: "ThriveMidlife 6-Week Mind-Body Reset Coaching Program"
        }
      });
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // Analytics endpoint
  app.get("/api/analytics/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
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

  const httpServer = createServer(app);
  return httpServer;
}
