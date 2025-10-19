import { MailService } from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY environment variable must be set");
}

const mailService = new MailService();
mailService.setApiKey(process.env.SENDGRID_API_KEY);

interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  try {
    await mailService.send({
      to: params.to,
      from: params.from,
      subject: params.subject,
      text: params.text,
      html: params.html,
    });
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}

// Email templates for BloomAfter40
export const emailTemplates = {
  welcome: (firstName: string) => ({
    subject: "Welcome to BloomAfter40 - Your Wellness Journey Begins!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #8B5CF6; margin-bottom: 10px;">BloomAfter40</h1>
          <p style="color: #6B7280; font-size: 16px;">Mind-Body Reset for Women</p>
        </div>
        
        <h2 style="color: #374151;">Welcome, ${firstName || 'Welcome'}!</h2>
        
        <p style="color: #6B7280; line-height: 1.6;">
          Thank you for joining BloomAfter40, your comprehensive wellness platform designed specifically for women navigating midlife transitions.
        </p>
        
        <div style="background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%); padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: white; margin: 0 0 10px 0;">What's Available for You:</h3>
          <ul style="color: white; margin: 0; padding-left: 20px;">
            <li>FREE comprehensive health assessments</li>
            <li>Mental, physical, and cognitive wellness tracking</li>
            <li>Dr. Sidra Bukhari's expert guidance</li>
            <li>Premium 6-week Mind-Body Reset program</li>
          </ul>
        </div>
        
        <p style="color: #6B7280; line-height: 1.6;">
          Start your journey today with our free health assessment dashboard to understand your current wellness baseline.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="#" style="background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Access Your Dashboard
          </a>
        </div>
        
        <p style="color: #9CA3AF; font-size: 14px; text-align: center; margin-top: 30px;">
          Dr. Sidra Bukhari, MRCPsych (UK) - Psychiatrist & Women's Wellness Expert<br>
          Transforming midlife transitions through evidence-based approaches
        </p>
      </div>
    `,
    text: `Welcome to BloomAfter40, ${firstName || ''}! Your comprehensive wellness platform for midlife women is ready. Access free health assessments and discover Dr. Sidra Bukhari's expert guidance for your mind-body transformation.`
  }),

  paymentConfirmation: (firstName: string, amount: number) => ({
    subject: "Payment Confirmed - Full BloomAfter40 Program Unlocked!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #8B5CF6; margin-bottom: 10px;">BloomAfter40</h1>
          <div style="background: #10B981; color: white; padding: 10px 20px; border-radius: 20px; display: inline-block;">
            ✓ Payment Confirmed
          </div>
        </div>
        
        <h2 style="color: #374151;">Congratulations, ${firstName || ''}!</h2>
        
        <p style="color: #6B7280; line-height: 1.6;">
          Your payment of $${amount} has been successfully processed. You now have lifetime access to Dr. Sidra Bukhari's complete 6-week Mind-Body Reset program.
        </p>
        
        <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin: 0 0 15px 0;">What You've Unlocked:</h3>
          <ul style="color: #6B7280; margin: 0; padding-left: 20px; line-height: 1.8;">
            <li><strong>24 Interactive Components</strong> - Complete therapeutic toolkit</li>
            <li><strong>6-Week Structured Program</strong> - Step-by-step transformation</li>
            <li><strong>CBT & NLP Techniques</strong> - Evidence-based approaches</li>
            <li><strong>Hormone & Nervous System Focus</strong> - Midlife-specific content</li>
            <li><strong>Lifetime Access</strong> - Revisit anytime</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="#" style="background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Start Your Transformation
          </a>
        </div>
        
        <p style="color: #6B7280; line-height: 1.6;">
          Your transformation journey begins now. We recommend starting with Week 1 to build a strong foundation for lasting change.
        </p>
        
        <p style="color: #9CA3AF; font-size: 14px; text-align: center; margin-top: 30px;">
          Dr. Sidra Bukhari, MRCPsych (UK)<br>
          Psychiatrist, NLP Life Coach & Women's Wellness Expert
        </p>
      </div>
    `,
    text: `Payment confirmed! Welcome to the complete BloomAfter40 program, ${firstName || ''}. You now have lifetime access to all 24 interactive components and Dr. Sidra Bukhari's 6-week Mind-Body Reset program. Start your transformation today!`
  }),

  weeklyReminder: (firstName: string, weekNumber: number, weekTitle: string) => ({
    subject: `Week ${weekNumber} Reminder: ${weekTitle} - BloomAfter40`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #8B5CF6; margin-bottom: 10px;">BloomAfter40</h1>
          <p style="color: #6B7280; font-size: 16px;">Week ${weekNumber} Check-in</p>
        </div>
        
        <h2 style="color: #374151;">Ready for Week ${weekNumber}, ${firstName || ''}?</h2>
        
        <p style="color: #6B7280; line-height: 1.6;">
          It's time to continue your transformation journey with <strong>${weekTitle}</strong>.
        </p>
        
        <div style="background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%); padding: 20px; border-radius: 8px; margin: 20px 0; color: white;">
          <h3 style="margin: 0 0 10px 0;">This Week's Focus:</h3>
          <p style="margin: 0; opacity: 0.9;">${weekTitle}</p>
        </div>
        
        <p style="color: #6B7280; line-height: 1.6;">
          Take a few moments today to engage with this week's interactive components. Your future self will thank you for the consistency.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="#" style="background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Continue Your Journey
          </a>
        </div>
        
        <p style="color: #9CA3AF; font-size: 14px; text-align: center; margin-top: 30px;">
          Dr. Sidra Bukhari, MRCPsych (UK)<br>
          Your partner in midlife wellness transformation
        </p>
      </div>
    `,
    text: `Week ${weekNumber} reminder: ${weekTitle}. Continue your BloomAfter40 transformation journey today, ${firstName || ''}. Consistency creates lasting change.`
  })
};