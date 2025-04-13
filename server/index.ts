import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { setupAuth } from "./auth"; // ✅ ADD THIS LINE

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

console.log('Environment:', process.env.NODE_ENV);
console.log('Database URL configured:', !!process.env.DATABASE_URL);
console.log('Session Secret configured:', !!process.env.SESSION_SECRET);

// ✅ Add auth setup here before routes
setupAuth(app);

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }
      log(logLine);
    }
  });

  next();
});

app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    console.log('API Request:', {
      method: req.method,
      path: req.path,
      body: req.body,
      user: req.user?.id
    });
  }
  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Error:', err);
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ 
      error: {
        message,
        details: process.env.NODE_ENV === 'development' ? err.stack : undefined
      }
    });
  });

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Try different ports if 5000 is taken
  const tryPort = async (startPort: number): Promise<number> => {
    for (let port = startPort; port < startPort + 10; port++) {
      try {
        await new Promise((resolve, reject) => {
          server.listen({
            port,
            host: "0.0.0.0",
            reusePort: true,
          }, () => {
            log(`Server running on port ${port}`);
            resolve(port);
          }).once('error', (err) => {
            if (err.code === 'EADDRINUSE') {
              log(`Port ${port} is in use, trying next port...`);
              resolve(false);
            } else {
              reject(err);
            }
          });
        });
        return port;
      } catch (err) {
        console.error(`Error trying port ${port}:`, err);
      }
    }
    throw new Error('No available ports found');
  };

  try {
    const port = await tryPort(5000);
    log(`Server successfully started on port ${port}`);
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
})();
