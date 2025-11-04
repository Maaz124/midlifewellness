import { db } from "./db";
import { eq } from "drizzle-orm";
import { adminConfig } from "@shared/schema";
import Stripe from "stripe";

interface StripeConfig {
  publishableKey: string;
  secretKey: string;
}

let cachedConfig: StripeConfig | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 60000; // 1 minute cache

/**
 * Get Stripe configuration from database with environment variable fallback
 * Results are cached for 1 minute to reduce database queries
 */
export async function getStripeConfig(): Promise<StripeConfig> {
  const now = Date.now();
  
  // Return cached config if still valid
  if (cachedConfig && (now - cacheTimestamp) < CACHE_TTL) {
    return cachedConfig;
  }

  try {
    const publishableKeyRow = await db
      .select()
      .from(adminConfig)
      .where(eq(adminConfig.key, 'stripe_publishable_key'))
      .limit(1);
    
    const secretKeyRow = await db
      .select()
      .from(adminConfig)
      .where(eq(adminConfig.key, 'stripe_secret_key'))
      .limit(1);
    
    // Fallback to environment variables if not in database
    const config: StripeConfig = {
      publishableKey: publishableKeyRow[0]?.value || process.env.STRIPE_PUBLISHABLE_KEY || '',
      secretKey: secretKeyRow[0]?.value || process.env.STRIPE_SECRET_KEY || '',
    };
    
    // Cache the result
    cachedConfig = config;
    cacheTimestamp = now;
    
    return config;
  } catch (error) {
    console.error('Error fetching Stripe config from database:', error);
    // Fallback to environment variables on error
    return {
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
      secretKey: process.env.STRIPE_SECRET_KEY || '',
    };
  }
}

/**
 * Get Stripe instance using database configuration
 */
export async function getStripeInstance(): Promise<Stripe | null> {
  const config = await getStripeConfig();
  if (!config.secretKey) {
    return null;
  }
  return new Stripe(config.secretKey, {
    apiVersion: "2025-06-30.basil",
  });
}

/**
 * Clear the Stripe config cache (call this after updating config)
 */
export function clearStripeConfigCache(): void {
  cachedConfig = null;
  cacheTimestamp = 0;
}

