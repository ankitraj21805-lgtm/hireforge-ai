import { Router } from "express";
import { db } from "@workspace/db";
import { jobsTable, resumesTable, githubAnalysesTable, activityTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { sessions } from "./auth";

const router = Router();

function getUserId(req: any): number | null {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return null;
  return sessions.get(auth.slice(7)) ?? null;
}

router.get("/stats", async (req, res) => {
  const userId = getUserId(req) ?? 1;

  const [jobs, resumes, githubAnalyses] = await Promise.all([
    db.select().from(jobsTable).where(eq(jobsTable.userId, userId)),
    db.select().from(resumesTable).where(eq(resumesTable.userId, userId)),
    db.select().from(githubAnalysesTable).where(eq(githubAnalysesTable.userId, userId)),
  ]);

  const activeApplications = jobs.filter(j => ["applied", "screening", "interview"].includes(j.status)).length;
  const offersReceived = jobs.filter(j => j.status === "offer").length;
  const interviewsScheduled = jobs.filter(j => j.status === "interview").length;

  const latestResume = resumes.sort((a, b) => b.analyzedAt.getTime() - a.analyzedAt.getTime())[0];
  const latestGithub = githubAnalyses.sort((a, b) => b.analyzedAt.getTime() - a.analyzedAt.getTime())[0];

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const weeklyActivity = jobs.filter(j => j.appliedAt > weekAgo).length +
    resumes.filter(r => r.analyzedAt > weekAgo).length +
    githubAnalyses.filter(g => g.analyzedAt > weekAgo).length;

  return res.json({
    totalJobs: jobs.length,
    activeApplications,
    resumeScore: latestResume?.score ?? 0,
    githubScore: latestGithub?.score ?? 0,
    weeklyActivity,
    offersReceived,
    interviewsScheduled,
  });
});

router.get("/activity", async (req, res) => {
  const userId = getUserId(req) ?? 1;

  const rows = await db.select().from(activityTable)
    .where(eq(activityTable.userId, userId))
    .orderBy(desc(activityTable.createdAt))
    .limit(20);

  return res.json(rows.map(a => ({
    id: a.id,
    type: a.type,
    description: a.description,
    createdAt: a.createdAt.toISOString(),
  })));
});

export default router;
