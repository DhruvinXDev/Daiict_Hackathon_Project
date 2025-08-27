import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express, Request } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as UserType } from "@shared/schema";

declare global {
  namespace Express {
    interface User extends UserType {}
  }
}

const scryptAsync = promisify(scrypt);

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  console.log('Setting up authentication...');
  console.log('Session secret configured:', !!process.env.SESSION_SECRET);
  console.log('Storage type:', storage.constructor.name);
  console.log('Session store type:', storage.sessionStore.constructor.name);
  
  try {
    const sessionSettings: session.SessionOptions = {
      secret: process.env.SESSION_SECRET || 'default_secret_key',
      resave: false,
      saveUninitialized: false,
      store: storage.sessionStore,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: 'lax'
      },
      name: 'sid'
    };

    app.use(session(sessionSettings));
    app.use(passport.initialize());
    app.use(passport.session());
    
    console.log('Authentication setup complete');
  } catch (error) {
    console.error('Error setting up authentication:', error);
    throw error;
  }

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: "Invalid username or password" });
        }

        const isValid = await comparePasswords(password, user.password);
        if (!isValid) {
          return done(null, false, { message: "Invalid username or password" });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // Add logging middleware
  app.use((req, _res, next) => {
    console.log('Session ID:', req.sessionID);
    console.log('Is Authenticated:', req.isAuthenticated());
    if (req.user) {
      console.log('User:', req.user);
    }
    next();
  });

  app.post("/api/register", async (req, res, next) => {
    console.log('Registration request received:', { 
      username: req.body.username, 
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      userType: req.body.userType,
      phone: req.body.phone,
      bio: req.body.bio
    });
    console.log('Full request body:', req.body);
    
    try {
      // Validate required fields
      const { username, email, password, firstName, lastName } = req.body;
      
      if (!username || !email || !password || !firstName || !lastName) {
        console.log('Missing required fields');
        return res.status(400).json({ 
          error: "Missing required fields: username, email, password, firstName, lastName" 
        });
      }

      // Check if user exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        console.log('Username already exists:', username);
        return res.status(400).json({ error: "Username already exists" });
      }

      // Also check email
      const existingEmail = await storage.getUserByEmail(email);
      if (existingEmail) {
        console.log('Email already exists:', email);
        return res.status(400).json({ error: "Email already exists" });
      }

      // Create user with hashed password
      const hashedPassword = await hashPassword(password);
      console.log('Creating user with username:', username);
      
      const user = await storage.createUser({
        username,
        email,
        password: hashedPassword,
        firstName,
        lastName,
        userType: req.body.userType || 'student', // Add userType field
        phone: req.body.phone || null,
        bio: req.body.bio || null,
      });

      console.log('User created successfully:', user.id);

      // Login the user
      req.login(user, (err) => {
        if (err) return next(err);
        // Don't send the password back to the client
        const { password, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
      });
    } catch (err) {
      console.error('Registration error:', err);
      
      // Handle error properly with type checking
      if (err instanceof Error) {
        console.error('Error stack:', err.stack);
        console.error('Error message:', err.message);
        
        // Send a more specific error response
        if (err.message && err.message.includes('validation')) {
          return res.status(400).json({ error: err.message });
        }
        
        res.status(500).json({ 
          error: "Internal server error during registration",
          details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
      } else {
        console.error('Unknown error type:', err);
        res.status(500).json({ 
          error: "Internal server error during registration",
          details: process.env.NODE_ENV === 'development' ? 'Unknown error type' : undefined
        });
      }
    }
  });

  app.post("/api/login", (req, res, next) => {
    console.log('Login request received for username:', req.body.username);
    
    // Validate required fields
    const { username, password } = req.body;
    
    if (!username || !password) {
      console.log('Missing required fields for login');
      return res.status(400).json({ 
        error: "Missing required fields: username and password" 
      });
    }

    passport.authenticate("local", (err: Error | null, user: UserType | false, info: any) => {
      if (err) {
        console.error('Passport authentication error:', err);
        return next(err);
      }
      if (!user) {
        console.log('Invalid credentials for username:', username);
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      console.log('User authenticated successfully:', user.username);
      
      req.login(user, (err) => {
        if (err) return next(err);
        // Don't send the password back to the client
        const { password, ...userWithoutPassword } = user;
        res.status(200).json(userWithoutPassword);
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: "Not authenticated" });
    // Don't send the password back to the client
    const { password, ...userWithoutPassword } = req.user as UserType;
    res.json(userWithoutPassword);
  });
}