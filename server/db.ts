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

// Use pg for localhost/127.0.0.1 and Docker service names, neon serverless for actual Neon databases
let db;
const hostname = new URL(databaseUrl).hostname;
const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
const isDockerService = hostname === 'db' || hostname.includes('.local') || hostname.includes('internal');
const isNeonDatabase = hostname.includes('neon.tech') || hostname.includes('neon') || databaseUrl.includes('neon.tech');

if (isLocalhost || isDockerService || !isNeonDatabase) {
  // Use regular PostgreSQL driver for localhost, Docker services, and non-Neon databases
  const pool = new PgPool({ connectionString: databaseUrl });
  db = drizzlePg(pool, { schema });
} else {
  // Use Neon serverless only for actual Neon databases
  const pool = new NeonPool({ connectionString: databaseUrl });
  db = drizzleNeon({ client: pool, schema });
}

export { db };