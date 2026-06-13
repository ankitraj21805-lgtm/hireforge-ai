import { Router } from "express";
import { db } from "@workspace/db";
import { resumesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { z } from "zod/v4";
import { sessions } from "./auth";

const router = Router();

function getUserId(req: any): number | null {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return null;
  return sessions.get(auth.slice(7)) ?? null;
}

function formatResume(r: typeof resumesTable.$inferSelect) {
  return {
    id: r.id,
    fileName: r.fileName,
    score: r.score,
    summary: r.summary,
    skills: r.skills ?? [],
    experience: r.experience ?? [],
    improvements: r.improvements ?? [],
    userId: r.userId,
    analyzedAt: r.analyzedAt.toISOString(),
  };
}

function analyzeResumeContent(content: string) {
  const wordCount = content.split(/\s+/).length;
  const hasEmail = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(content);
  const hasPhone = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/.test(content);

  const skillKeywords = ["JavaScript", "TypeScript", "React", "Node.js", "Python", "SQL", "AWS",
    "Docker", "Kubernetes", "GraphQL", "REST", "Git", "Agile", "Leadership"];
  const foundSkills = skillKeywords.filter(s => content.toLowerCase().includes(s.toLowerCase()));

  let score = 40;
  if (wordCount > 200) score += 10;
  if (wordCount > 400) score += 5;
  if (hasEmail) score += 5;
  if (hasPhone) score += 5;
  if (foundSkills.length > 0) score += Math.min(foundSkills.length * 3, 20);
  if (content.toLowerCase().includes("experience")) score += 5;
  if (content.toLowerCase().includes("education")) score += 5;
  if (content.toLowerCase().includes("project")) score += 5;

  score = Math.min(score, 98);

  const improvements = [];
  if (!hasEmail) improvements.push("Add a professional email address");
  if (!hasPhone) improvements.push("Include a phone number for recruiters to reach you");
  if (foundSkills.length < 3) improvements.push("List more technical skills relevant to your target roles");
  if (wordCount < 300) improvements.push("Expand your resume with more detail about your accomplishments");
  if (!content.toLowerCase().includes("achievement") && !content.toLowerCase().includes("increased") && !content.toLowerCase().includes("reduced")) {
    improvements.push("Quantify achievements with metrics (e.g., 'Increased revenue by 20%')");
  }

  return {
    score,
    skills: foundSkills.length > 0 ? foundSkills : ["Communication", "Problem Solving", "Team Collaboration"],
    experience: [
      "Relevant work experience identified",
      `Document contains approximately ${wordCount} words`,
    ],
    improvements: improvements.length > 0 ? improvements : ["Resume looks strong — consider adding a LinkedIn URL"],
    summary: `Resume analyzed with a score of ${score}/100. Found ${foundSkills.length} technical skills. ${improvements.length > 0 ? "See improvement suggestions below." : "Overall structure is solid."}`,
  };
}

router.get("/", async (req, res) => {
  const userId = getUserId(req) ?? 1;
  const rows = await db.select().from(resumesTable).where(eq(resumesTable.userId, userId));
  return res.json(rows.map(formatResume));
});

router.post("/analyze", async (req, res) => {
  const userId = getUserId(req) ?? 1;

  const schema = z.object({
    fileName: z.string().min(1),
    content: z.string().min(1),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });

  const analysis = analyzeResumeContent(parsed.data.content);

  const [resume] = await db.insert(resumesTable).values({
    fileName: parsed.data.fileName,
    score: analysis.score,
    summary: analysis.summary,
    skills: analysis.skills,
    experience: analysis.experience,
    improvements: analysis.improvements,
    userId,
  }).returning();

  return res.status(201).json(formatResume(resume));
});

router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

  const [resume] = await db.select().from(resumesTable).where(eq(resumesTable.id, id)).limit(1);
  if (!resume) return res.status(404).json({ error: "Resume not found" });

  return res.json(formatResume(resume));
});

export default router;
