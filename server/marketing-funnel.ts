import { db } from './db';
import { leads, emailCampaigns, emailSends, conversionEvents } from '@shared/schema';
import { sendEmail } from './email';
import { eq, and, desc, sql } from 'drizzle-orm';

// Lead Management
export class MarketingFunnel {
  
  // Lead Capture
  async captureLead(leadData: {
    email: string;
    firstName?: string;
    lastName?: string;
    source: string;
    leadMagnet?: string;
  }) {
    try {
      // Check if lead already exists
      const existingLead = await db
        .select()
        .from(leads)
        .where(eq(leads.email, leadData.email))
        .limit(1);

      let lead;
      if (existingLead.length > 0) {
        // Update existing lead
        [lead] = await db
          .update(leads)
          .set({
            lastEngaged: new Date(),
            ...(leadData.firstName && { firstName: leadData.firstName }),
            ...(leadData.lastName && { lastName: leadData.lastName })
          })
          .where(eq(leads.email, leadData.email))
          .returning();
      } else {
        // Create new lead
        [lead] = await db
          .insert(leads)
          .values(leadData)
          .returning();

        // Trigger welcome sequence
        await this.triggerWelcomeSequence(lead.id);
      }

      // Track conversion event
      await this.trackConversion(lead.id, 'lead_captured', { source: leadData.source });

      return lead;
    } catch (error) {
      console.error('Error capturing lead:', error);
      throw error;
    }
  }

  // Welcome Email Sequence
  async triggerWelcomeSequence(leadId: number) {
    const welcomeSequence = [
      {
        subject: "Welcome! Your Free Hormone Reset Guide is Here 🌸",
        delayDays: 0,
        template: 'leadMagnetDelivery'
      },
      {
        subject: "Did you take the assessment yet? Your results are waiting",
        delayDays: 2,
        template: 'assessmentReminder'
      },
      {
        subject: "3 Signs Your Hormones Need Attention (Most Women Miss #2)",
        delayDays: 5,
        template: 'educationalContent1'
      },
      {
        subject: "The #1 Mistake Women Make During Perimenopause",
        delayDays: 8,
        template: 'educationalContent2'
      },
      {
        subject: "Ready to transform your midlife experience?",
        delayDays: 12,
        template: 'softPitch'
      }
    ];

    for (const email of welcomeSequence) {
      await this.scheduleEmail(leadId, email.subject, email.template, email.delayDays);
    }
  }

  // Schedule Email
  async scheduleEmail(leadId: number, subject: string, templateType: string, delayDays: number) {
    // In a real implementation, you'd use a job queue like Bull or agenda
    // For now, we'll simulate with setTimeout
    setTimeout(async () => {
      await this.sendScheduledEmail(leadId, subject, templateType);
    }, delayDays * 24 * 60 * 60 * 1000); // Convert days to milliseconds
  }

  // Send Scheduled Email
  async sendScheduledEmail(leadId: number, subject: string, templateType: string) {
    try {
      const [lead] = await db
        .select()
        .from(leads)
        .where(eq(leads.id, leadId))
        .limit(1);

      if (!lead || lead.status !== 'active') {
        return;
      }

      const emailContent = this.getEmailTemplate(templateType, lead);
      
      const success = await sendEmail({
        to: lead.email,
        from: 'dr.sidra@thrivemidlife.com',
        subject: subject,
        html: emailContent.html,
        text: emailContent.text
      });

      // Track email send
      if (success) {
        await db.insert(emailSends).values({
          leadId: lead.id,
          campaignId: null, // Could reference campaign table
          opened: false,
          clicked: false
        });
      }

    } catch (error) {
      console.error('Error sending scheduled email:', error);
    }
  }

  // Email Templates for Nurture Sequence
  getEmailTemplate(templateType: string, lead: any) {
    const templates = {
      leadMagnetDelivery: {
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #9333ea;">Welcome to ThriveMidlife, ${lead.firstName || 'Beautiful'}!</h1>
            
            <p>I'm so excited you're here! Your journey to vibrant midlife wellness starts now.</p>
            
            <div style="background: linear-gradient(135deg, #f3e8ff 0%, #fce7f3 100%); padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h2 style="color: #7c3aed;">🎁 Your Free Gift is Ready!</h2>
              <p><strong>"The 5-Day Hormone Reset Guide"</strong> - Normally $47, yours free!</p>
              <a href="/dashboard" style="background: #9333ea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0;">Download Your Guide</a>
            </div>
            
            <h3>Here's what you'll discover:</h3>
            <ul>
              <li>✨ The 3 hormone-balancing foods to eat daily</li>
              <li>🧘‍♀️ A 5-minute morning routine to reset your nervous system</li>
              <li>💤 The sleep secret that changes everything</li>
              <li>🌱 Simple supplements that actually work</li>
            </ul>
            
            <p><strong>Next Step:</strong> Take your free wellness assessment to get personalized recommendations for your unique situation.</p>
            
            <a href="/dashboard" style="background: #9333ea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">Take My Free Assessment</a>
            
            <p>To your vibrant health,<br>
            Dr. Sidra Bukhari<br>
            <em>Psychiatrist & Women's Wellness Expert</em></p>
          </div>
        `,
        text: `Welcome to ThriveMidlife, ${lead.firstName || 'Beautiful'}!
        
Your free "5-Day Hormone Reset Guide" is ready for download.
Visit /dashboard to access your guide and take the wellness assessment.

To your vibrant health,
Dr. Sidra Bukhari`
      },

      assessmentReminder: {
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #9333ea;">Quick Check-in, ${lead.firstName || 'Beautiful'}</h1>
            
            <p>I noticed you haven't taken your wellness assessment yet. No worries - life gets busy!</p>
            
            <p>But here's the thing: <strong>You can't manage what you don't measure.</strong></p>
            
            <div style="background: #fef3cd; padding: 20px; border-left: 4px solid #f59e0b; margin: 20px 0;">
              <p><strong>Did you know?</strong> 89% of women who complete the assessment say it gave them clarity they didn't know they needed.</p>
            </div>
            
            <p>Your personalized results will show you:</p>
            <ul>
              <li>🎯 Your biggest wellness opportunity</li>
              <li>📊 How you compare to other women your age</li>
              <li>🛤️ Your custom roadmap for improvement</li>
            </ul>
            
            <p>It takes just 5 minutes and the insights last a lifetime.</p>
            
            <a href="/dashboard" style="background: #9333ea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">Complete My Assessment</a>
            
            <p>Cheering you on,<br>Dr. Sidra</p>
          </div>
        `,
        text: `Quick check-in! Haven't taken your wellness assessment yet? It only takes 5 minutes and gives you personalized insights. Complete it at /dashboard`
      },

      educationalContent1: {
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #9333ea;">3 Signs Your Hormones Need Attention</h1>
            
            <p>Hi ${lead.firstName || 'Beautiful'},</p>
            
            <p>As a psychiatrist who specializes in women's wellness, I see these signs every day. Most women think they're "just getting older" but the truth is...</p>
            
            <p><strong>Your hormones are trying to tell you something important.</strong></p>
            
            <h3 style="color: #7c3aed;">Sign #1: You're Tired But Wired</h3>
            <p>Exhausted all day but can't fall asleep at night? That's your cortisol rhythm crying for help.</p>
            
            <h3 style="color: #7c3aed;">Sign #2: Your Mood is a Rollercoaster (Most Women Miss This!)</h3>
            <p>Snapping at loved ones, then feeling guilty? It's not your personality - it's your progesterone dropping.</p>
            
            <h3 style="color: #7c3aed;">Sign #3: Your Brain Feels Foggy</h3>
            <p>Forgetting words, losing focus, feeling "not quite yourself"? Estrogen decline affects your brain first.</p>
            
            <div style="background: linear-gradient(135deg, #f3e8ff 0%, #fce7f3 100%); padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h3>The Good News?</h3>
              <p>All of these are completely addressable with the right approach. Your body wants to feel good - it just needs the right support.</p>
            </div>
            
            <p>That's exactly what we address in the Mind-Body Reset program.</p>
            
            <a href="/coaching" style="background: #9333ea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">Learn More About the Program</a>
            
            <p>Supporting your journey,<br>Dr. Sidra</p>
          </div>
        `,
        text: `3 Signs Your Hormones Need Attention: 1) Tired but wired, 2) Mood swings, 3) Brain fog. These are all addressable! Learn more at /coaching`
      },

      softPitch: {
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #9333ea;">Are You Ready to Feel Like Yourself Again?</h1>
            
            <p>Hi ${lead.firstName || 'Beautiful'},</p>
            
            <p>Over the past couple weeks, I've shared some insights about midlife wellness. But I want to ask you something important:</p>
            
            <p><strong>How long are you willing to feel "not quite yourself"?</strong></p>
            
            <p>I know you're strong. I know you've handled everything life has thrown at you. But here's what I've learned in my practice:</p>
            
            <p><em>You don't have to white-knuckle your way through this transition.</em></p>
            
            <div style="background: #fef3cd; padding: 20px; border-left: 4px solid #f59e0b; margin: 20px 0;">
              <p><strong>What if you could:</strong></p>
              <ul>
                <li>✨ Wake up feeling energized instead of exhausted</li>
                <li>🧠 Think clearly and remember things easily</li>
                <li>😌 Feel calm and centered, even during stressful times</li>
                <li>❤️ Reconnect with the confident woman you've always been</li>
              </ul>
            </div>
            
            <p>That's what happens when you have the right roadmap. And that's exactly what the Mind-Body Reset program provides.</p>
            
            <p><strong>This week only,</strong> I'm offering early access with a special investment of just $97 (normally $297).</p>
            
            <p>But more importantly than the savings - you get to start feeling like yourself again. Isn't that worth everything?</p>
            
            <a href="/checkout" style="background: #9333ea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">Yes, I'm Ready to Transform</a>
            
            <p>Here's to your vibrant next chapter,<br>
            Dr. Sidra Bukhari</p>
            
            <p style="font-size: 12px; color: #666;">P.S. Remember, you have a 30-day money-back guarantee. The only risk is staying where you are.</p>
          </div>
        `,
        text: `Ready to feel like yourself again? The Mind-Body Reset program is available for $97 this week (normally $297). Start your transformation at /checkout`
      }
    };

    return templates[templateType as keyof typeof templates] || templates.leadMagnetDelivery;
  }

  // Track Conversions
  async trackConversion(leadId: number, eventType: string, eventData?: any, value?: number) {
    try {
      await db.insert(conversionEvents).values({
        leadId,
        eventType,
        eventData,
        value: value?.toString()
      });

      // Update lead status if it's a purchase
      if (eventType === 'coaching_purchased') {
        await db
          .update(leads)
          .set({ 
            status: 'converted',
            convertedAt: new Date()
          })
          .where(eq(leads.id, leadId));
      }
    } catch (error) {
      console.error('Error tracking conversion:', error);
    }
  }

  // Analytics
  async getFunnelAnalytics() {
    try {
      const totalLeads = await db
        .select({ count: sql<number>`count(*)` })
        .from(leads);

      const convertedLeads = await db
        .select({ count: sql<number>`count(*)` })
        .from(leads)
        .where(eq(leads.status, 'converted'));

      const recentLeads = await db
        .select({ count: sql<number>`count(*)` })
        .from(leads)
        .where(sql`created_at >= NOW() - INTERVAL '30 days'`);

      return {
        totalLeads: totalLeads[0]?.count || 0,
        convertedLeads: convertedLeads[0]?.count || 0,
        conversionRate: totalLeads[0]?.count > 0 
          ? ((convertedLeads[0]?.count || 0) / totalLeads[0].count * 100).toFixed(2)
          : '0',
        recentLeads: recentLeads[0]?.count || 0
      };
    } catch (error) {
      console.error('Error fetching funnel analytics:', error);
      return {
        totalLeads: 0,
        convertedLeads: 0,
        conversionRate: '0',
        recentLeads: 0
      };
    }
  }
}

export const marketingFunnel = new MarketingFunnel();