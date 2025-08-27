import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";
import * as dotenv from "dotenv";
dotenv.config();

neonConfig.webSocketConstructor = ws;

// Only create database connection if DATABASE_URL is available
let pool: Pool | null = null;
let db: any = null;

if (process.env.DATABASE_URL) {
  try {
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
    db = drizzle(pool, { schema });
    
    // Verify database connection
    pool.query('SELECT NOW()')
      .then(result => {
        console.log('Database connection successful:', result.rows[0].now);
      })
      .catch(error => {
        console.error('Database connection failed:', error);
        console.log('Falling back to in-memory storage');
      });
  } catch (error) {
    console.error('Failed to initialize database:', error);
    console.log('Falling back to in-memory storage');
  }
} else {
  console.log('No DATABASE_URL provided, using in-memory storage');
}

export { pool, db };