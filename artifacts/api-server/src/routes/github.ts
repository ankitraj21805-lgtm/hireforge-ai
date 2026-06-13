import { Router } from "express";
import { db } from "@workspace/db";
import { githubAnalysesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { z } from "zod/v4";
import { sessions } from "./auth";

const router = Router();

function getUserId(req: any): number | null {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return null;
  return sessions.get(auth.slice(7)) ?? null;
}

function formatAnalysis(a: typeof githubAnalysesTable.$inferSelect) {
  return {
    id: a.id,
    username: a.username,
    score: a.score,
    repoCount: a.repoCount,
    commitScore: a.commitScore,
    topLanguages: a.topLanguages ?? [],
    summary: a.summary,
    strengths: a.strengths ?? [],
    userId: a.userId,
    analyzedAt: a.analyzedAt.toISOString(),
  };
}

function generateGithubAnalysis(username: string) {
  // Deterministic mock analysis based on username
  const seed = username.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const rand = (min: number, max: number) => min + (seed % (max - min + 1));

  const repoCount = rand(8, 85);
  const commitScore = rand(45, 98);
  const score = Math.floor((repoCount / 85 * 30) + (commitScore * 0.5) + rand(10, 20));
  const cappedScore = Math.min(score, 97);

  const allLanguages = ["TypeScript", "JavaScript", "Python", "Go", "Rust", "Java", "C++", "Ruby", "Swift", "Kotlin"];
  const langCount = rand(2, 5);
  const topLanguages = allLanguages.slice(seed % 5, (seed % 5) + langCount);

  const strengthPool = [
    "Consistent commit history shows strong work ethic",
    "Wide variety of project types demonstrates versatility",
    "Open source contributions indicate collaborative mindset",
    "Documentation quality is above average",
    "Strong testing practices observed across repositories",
    "Active community engagement through issues and PRs",
    "Clean repository organization and naming conventions",
  ];
  const strengths = strengthPool.slice(seed % 3, (seed % 3) + rand(2, 4));

  return {
    score: cappedScore,
    repoCount,
    commitScore,
    topLanguages,
    strengths,
    summary: `GitHub profile analysis for @${username}: Overall developer score ${cappedScore}/100. ${repoCount} public repositories analyzed. Primary languages: ${topLanguages.slice(0, 2).join(" and ")}. Commit activity score: ${commitScore}/100.`,
  };
}

router.post("/analyze", async (req, res) => {
  const userId = getUserId(req) ?? 1;

  const schema = z.object({ username: z.string().min(1) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });

  const analysis = generateGithubAnalysis(parsed.data.username);

  const [row] = await db.insert(githubAnalysesTable).values({
    username: parsed.data.username,
    ...analysis,
    userId,
  }).returning();

  return res.status(201).json(formatAnalysis(row));
});

router.get("/analyses", async (req, res) => {
  const userId = getUserId(req) ?? 1;
  const rows = await db.select().from(githubAnalysesTable).where(eq(githubAnalysesTable.userId, userId));
  return res.json(rows.map(formatAnalysis));
});

router.get("/analyses/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

  const [row] = await db.select().from(githubAnalysesTable).where(eq(githubAnalysesTable.id, id)).limit(1);
  if (!row) return res.status(404).json({ error: "Analysis not found" });

  return res.json(formatAnalysis(row));
});

export default router;
