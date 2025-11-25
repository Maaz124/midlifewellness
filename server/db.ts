import { Pool as NeonPool, neonConfig } from '@neondatabase/serverless';
import { Pool as PgPool } from 'pg';
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-serverless';
import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Use pg for local PostgreSQL instances (localhost, 127.0.0.1, or Docker service names like 'db')
// Use Neon serverless only for actual Neon database URLs (contains 'neon.tech' or 'neon.tech')
const dbUrl = new URL(databaseUrl);
const hostname = dbUrl.hostname;
const isNeonDatabase = hostname.includes('neon.tech') || hostname.includes('neon') || databaseUrl.includes('@ep-');
const isLocalPostgres = hostname === 'localhost' || 
                        hostname === '127.0.0.1' || 
                        hostname === 'db' || // Docker service name
                        hostname.includes('.local') || // Docker internal domains
                        !isNeonDatabase; // Default to pg if not clearly a Neon URL

let db;
if (isLocalPostgres) {
  // Use standard PostgreSQL driver for local/Docker databases
  const pool = new PgPool({ connectionString: databaseUrl });
  db = drizzlePg(pool, { schema });
} else {
  // Use Neon serverless for Neon cloud databases
  const pool = new NeonPool({ connectionString: databaseUrl });
  db = drizzleNeon({ client: pool, schema });
}

export { db };