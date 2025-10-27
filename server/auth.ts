import { Express, RequestHandler } from "express";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";
import { registerSchema, loginSchema } from "@shared/schema";

const SALT_ROUNDS = 12;

declare module 'express-session' {
  interface SessionData {
    userId?: string;
  }
}

export async function setupCustomAuth(app: Express) {
  // Register endpoint
  app.post('/api/auth/register', async (req, res) => {
    try {
      const validatedData = registerSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, validatedData.email))
        .limit(1);

      if (existingUser.length > 0) {
        return res.status(400).json({ message: "Email already registered" });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(validatedData.password, SALT_ROUNDS);

      // Create user with unique ID
      const userId = nanoid();
      const [newUser] = await db.insert(users).values({
        id: userId,
        email: validatedData.email,
        passwordHash,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        phone: validatedData.phone || null,
        emailVerified: false,
      }).returning();

      // Regenerate session to prevent session fixation attacks
      req.session.regenerate((err) => {
        if (err) {
          console.error('Session regeneration error:', err);
          return res.status(500).json({ message: "Registration failed - session error" });
        }

        // Set user ID in new session
        req.session.userId = newUser.id;

        // Save session before responding
        req.session.save((saveErr) => {
          if (saveErr) {
            console.error('Session save error:', saveErr);
            return res.status(500).json({ message: "Registration failed - session save error" });
          }

          // Return user without password hash
          const { passwordHash: _, ...userWithoutPassword } = newUser;
          res.status(201).json({ 
            message: "Registration successful", 
            user: userWithoutPassword 
          });
        });
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      console.error('Registration error:', error);
      res.status(500).json({ message: "Registration failed" });
    }
  });

  // Login endpoint
  app.post('/api/auth/login', async (req, res) => {
    try {
      const validatedData = loginSchema.parse(req.body);

      // Find user by email
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, validatedData.email))
        .limit(1);

      if (!user || !user.passwordHash) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(
        validatedData.password, 
        user.passwordHash
      );

      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Regenerate session to prevent session fixation attacks
      req.session.regenerate((err) => {
        if (err) {
          console.error('Session regeneration error:', err);
          return res.status(500).json({ message: "Login failed - session error" });
        }

        // Set user ID in new session
        req.session.userId = user.id;

        // Save session before responding
        req.session.save((saveErr) => {
          if (saveErr) {
            console.error('Session save error:', saveErr);
            return res.status(500).json({ message: "Login failed - session save error" });
          }

          // Return user without password hash
          const { passwordHash: _, ...userWithoutPassword } = user;
          res.json({ 
            message: "Login successful", 
            user: userWithoutPassword 
          });
        });
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      console.error('Login error:', error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Logout endpoint
  app.post('/api/auth/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.clearCookie('connect.sid');
      res.json({ message: "Logout successful" });
    });
  });

  // Get current user endpoint
  app.get('/api/auth/user', async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, req.session.userId))
        .limit(1);

      if (!user) {
        req.session.destroy(() => {});
        return res.status(401).json({ message: "User not found" });
      }

      // Return user without password hash
      const { passwordHash: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ message: "Failed to get user" });
    }
  });
}

// Authentication middleware
export const isAuthenticated: RequestHandler = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
};

// Payment check middleware (checks if user has active subscription/purchase)
export const hasPayment: RequestHandler = async (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Authentication required" });
  }

  // TODO: Implement payment verification logic
  // For now, we'll check if the user exists and assume they have payment
  // In production, you'd check the Stripe subscription status or purchase records
  
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, req.session.userId))
      .limit(1);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // TODO: Add actual payment verification here
    // For now, passing through for development
    next();
  } catch (error) {
    console.error('Payment check error:', error);
    res.status(500).json({ message: "Payment verification failed" });
  }
};
