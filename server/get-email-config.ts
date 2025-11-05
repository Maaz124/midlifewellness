import { db } from "./db";
import { eq } from "drizzle-orm";
import { adminConfig } from "@shared/schema";

interface EmailConfig {
  gmailUser: string;
  gmailAppPassword: string;
  coachingInbox: string;
}

let cachedConfig: EmailConfig | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 60000; // 1 minute cache

/**
 * Get email configuration from database with environment variable fallback
 * Results are cached for 1 minute to reduce database queries
 */
export async function getEmailConfig(): Promise<EmailConfig> {
  const now = Date.now();
  
  // Return cached config if still valid
  if (cachedConfig && (now - cacheTimestamp) < CACHE_TTL) {
    return cachedConfig;
  }

  try {
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
    
    // Fallback to environment variables if not in database
    const config: EmailConfig = {
      gmailUser: gmailUserRow[0]?.value || process.env.GMAIL_USER || '',
      gmailAppPassword: gmailAppPasswordRow[0]?.value || process.env.GMAIL_APP_PASSWORD || process.env.GMAIL_PASS || '',
      coachingInbox: coachingInboxRow[0]?.value || process.env.COACHING_INBOX || 'coaching@midliferebalance.com',
    };
    
    // Cache the result
    cachedConfig = config;
    cacheTimestamp = now;
    
    return config;
  } catch (error) {
    console.error('Error fetching email config from database:', error);
    // Fallback to environment variables on error
    return {
      gmailUser: process.env.GMAIL_USER || '',
      gmailAppPassword: process.env.GMAIL_APP_PASSWORD || process.env.GMAIL_PASS || '',
      coachingInbox: process.env.COACHING_INBOX || 'coaching@midliferebalance.com',
    };
  }
}

/**
 * Clear the email config cache (call this after updating config)
 */
export function clearEmailConfigCache(): void {
  cachedConfig = null;
  cacheTimestamp = 0;
}

