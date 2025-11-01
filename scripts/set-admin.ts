import "dotenv/config";
import { db } from "../server/db.js";
import { users } from "../shared/schema.js";
import { eq } from "drizzle-orm";

const email = process.argv[2];

if (!email) {
  console.error("Usage: npm run set-admin <email>");
  console.error("Example: npm run set-admin admin@example.com");
  process.exit(1);
}

try {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user) {
    console.error(`User with email "${email}" not found.`);
    console.error("Please register the user first, then run this script.");
    process.exit(1);
  }

  if (user.isAdmin) {
    console.log(`User ${email} is already an admin.`);
    process.exit(0);
  }

  await db
    .update(users)
    .set({ isAdmin: true })
    .where(eq(users.email, email));

  console.log(`✓ Successfully set ${email} as admin.`);
  console.log(`  User: ${user.firstName || ""} ${user.lastName || ""} (${user.email})`);
} catch (error) {
  console.error("Error setting admin:", error);
  process.exit(1);
}

process.exit(0);

