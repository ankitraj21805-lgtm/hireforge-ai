import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable, jobsTable, resumesTable, githubAnalysesTable } from "@workspace/db";
import { sql } from "drizzle-orm";

const router = Router();

router.get("/stats", async (_req, res) => {
  const [users, jobs, resumes, githubAnalyses] = await Promise.all([
    db.select().from(usersTable),
    db.select().from(jobsTable),
    db.select().from(resumesTable),
    db.select().from(githubAnalysesTable),
  ]);

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const newUsersThisWeek = users.filter(u => u.createdAt > weekAgo).length;
  const activeToday = users.filter(u => u.createdAt > dayAgo).length;

  return res.json({
    totalUsers: users.length,
    totalJobs: jobs.length,
    totalResumes: resumes.length,
    totalGithubAnalyses: githubAnalyses.length,
    activeToday,
    newUsersThisWeek,
  });
});

export default router;
