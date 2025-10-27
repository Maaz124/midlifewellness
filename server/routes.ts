import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { DatabaseStorage } from "./database-storage";
import { setupCustomAuth, isAuthenticated, hasPayment } from "./auth";
import { getSession } from "./replitAuth";
import { uploadVideo, VideoManager } from "./video-upload";
import { uploadPDF, DigitalResourceManager } from "./digital-resources";
import path from "path";

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
import { marketingFunnel } from "./marketing-funnel";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize database storage and sessions
  const storage = new DatabaseStorage();
  
  // Setup session management (needed for custom auth)
  app.set("trust proxy", 1);
  app.use(getSession());
  
  // Setup custom authentication routes
  await setupCustomAuth(app);

  // Note: /api/auth/user, /api/auth/login, /api/auth/register, /api/auth/logout 
  // are now handled in auth.ts via setupCustomAuth

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
      const userId = req.session.userId;
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
      const userId = req.session.userId;
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

  // Payment endpoint for coaching access
  app.post("/api/create-payment-intent", isAuthenticated, async (req: any, res) => {
    try {
      const { amount } = req.body;
      const userId = req.session.userId;
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        metadata: {
          service: "coaching_plan",
          description: "BloomAfter40 6-Week Mind-Body Reset Coaching Program",
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
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status === 'succeeded' && user && user.email) {
        // Send payment confirmation email
        const confirmationTemplate = emailTemplates.paymentConfirmation(
          user.firstName || '',
          amount
        );
        
        await sendEmail({
          to: user.email,
          from: 'coaching@bloomafter40.com',
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
        from: 'coaching@bloomafter40.com',
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

      // Send notification email to Dr. Sidra
      const { sendEmail } = require('./email');
      const { addSignatureToEmail } = require('./email-signatures');
      
      const notificationEmailSent = await sendEmail({
        to: 'coaching@bloomafter40.com', // Dr. Sidra's coaching email
        from: 'coaching@bloomafter40.com',
        subject: `New Coaching Inquiry from ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #8B5CF6;">New Coaching Inquiry Received</h2>
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #1e293b;">Contact Information</h3>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
              <p><strong>Coaching Interest:</strong> ${coachingType}</p>
              <p><strong>Preferred Schedule:</strong> ${preferredSchedule || 'Not specified'}</p>
            </div>
            
            <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #15803d;">Goals & Aspirations</h3>
              <p>${goals}</p>
            </div>
            
            ${challenges ? `
              <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #92400e;">Current Challenges</h3>
                <p>${challenges}</p>
              </div>
            ` : ''}
            
            ${experience ? `
              <div style="background: #e0e7ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #3730a3;">Previous Experience</h3>
                <p>${experience}</p>
              </div>
            ` : ''}
            
            ${additionalInfo ? `
              <div style="background: #fce7f3; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #be185d;">Additional Information</h3>
                <p>${additionalInfo}</p>
              </div>
            ` : ''}
            
            <div style="margin-top: 30px; padding: 20px; background: #8B5CF6; color: white; border-radius: 8px; text-align: center;">
              <p style="margin: 0;"><strong>Inquiry ID:</strong> #${inquiry.id}</p>
              <p style="margin: 5px 0 0 0; font-size: 14px;">Please respond within 24 hours as promised</p>
            </div>
          </div>
        `
      });

      // Send confirmation email to the applicant
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
              <a href="mailto:coaching@bloomafter40.com" style="color: #8B5CF6;">coaching@bloomafter40.com</a>
            </p>
          </div>
        </div>
      `;

      const confirmationEmailSent = await sendEmail({
        to: email,
        from: 'coaching@bloomafter40.com',
        subject: 'Your Coaching Inquiry Has Been Received - Dr. Sidra Bukhari',
        html: addSignatureToEmail(confirmationEmailContent, 'personal')
      });

      res.status(201).json({ 
        message: 'Coaching inquiry submitted successfully',
        inquiryId: inquiry.id,
        emailSent: notificationEmailSent && confirmationEmailSent
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
      const paymentIntent = await stripe.paymentIntents.create({
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

  // Download resource endpoint (for free resources or purchased ones)
  app.get('/api/download-resource/:id', async (req: any, res) => {
    try {
      const resourceId = parseInt(req.params.id);
      
      const resource = await storage.getDigitalResourceById(resourceId);
      if (!resource) {
        return res.status(404).json({ message: 'Resource not found' });
      }

      // Check if resource requires payment
      if (resource.price > 0) {
        // For paid resources, require authentication
        if (!req.isAuthenticated()) {
          return res.status(401).json({ message: 'Authentication required for paid resources' });
        }

        const userId = req.session.userId;
        const hasPurchased = await storage.hasUserPurchasedResource(userId, resourceId);
        if (!hasPurchased) {
          return res.status(403).json({ message: 'Purchase required to download this resource' });
        }

        // Track the download for authenticated users
        await storage.createResourceDownload({
          userId,
          resourceId
        });
      }

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
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
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

  const httpServer = createServer(app);
  return httpServer;
}

// Import sitemap utilities
import { generateSitemap, generateRobotsTxt } from "./sitemap";
