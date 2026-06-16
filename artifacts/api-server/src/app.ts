import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import crypto from "node:crypto";
import { eq } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + "hireforge_salt").digest("hex");
}

async function seedDemoUsers() {
  const demoUsers = [
    {
      name: "Alex Carter",
      email: "alex@hireforge.ai",
      passwordHash: hashPassword("password123"),
      role: "user",
      company: "HireForge AI",
      title: "Career Professional",
    },
    {
      name: "Jordan Lee",
      email: "jordan@hireforge.ai",
      passwordHash: hashPassword("password123"),
      role: "admin",
      company: "HireForge AI",
      title: "Platform Admin",
    },
  ];

  for (const demoUser of demoUsers) {
    const existing = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, demoUser.email))
      .limit(1);

    if (existing.length === 0) {
      await db.insert(usersTable).values(demoUser);
      logger.info({ email: demoUser.email, role: demoUser.role }, "Seeded demo user");
    }
  }
}

seedDemoUsers().catch((err) => {
  logger.error({ err }, "Failed to seed demo users");
});

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "HireForge AI API",
    message: "Backend is running successfully.",
    apiBasePath: "/api",
    healthCheck: "/api/health",
  });
});

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "healthy",
    service: "HireForge AI API",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api", router);

export default app;
