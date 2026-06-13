import { Router } from "express";
import { db } from "@workspace/db";
import { jobsTable } from "@workspace/db";
import { eq, and, ilike, sql } from "drizzle-orm";
import { z } from "zod/v4";
import { sessions } from "./auth";

const router = Router();

function getUserId(req: any): number | null {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return null;
  return sessions.get(auth.slice(7)) ?? null;
}

function formatJob(j: typeof jobsTable.$inferSelect) {
  return {
    id: j.id,
    title: j.title,
    company: j.company,
    location: j.location,
    status: j.status,
    salary: j.salary,
    url: j.url,
    notes: j.notes,
    appliedAt: j.appliedAt.toISOString(),
    userId: j.userId,
  };
}

router.get("/stats", async (req, res) => {
  const userId = getUserId(req) ?? 1;

  const rows = await db.select().from(jobsTable).where(eq(jobsTable.userId, userId));

  const stats = {
    total: rows.length,
    applied: rows.filter(j => j.status === "applied").length,
    screening: rows.filter(j => j.status === "screening").length,
    interview: rows.filter(j => j.status === "interview").length,
    offer: rows.filter(j => j.status === "offer").length,
    rejected: rows.filter(j => j.status === "rejected").length,
  };

  return res.json(stats);
});

router.get("/", async (req, res) => {
  const userId = getUserId(req) ?? 1;
  const { status, search } = req.query as { status?: string; search?: string };

  let rows = await db.select().from(jobsTable).where(eq(jobsTable.userId, userId));

  if (status) {
    rows = rows.filter(j => j.status === status);
  }
  if (search) {
    const q = search.toLowerCase();
    rows = rows.filter(j =>
      j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q)
    );
  }

  return res.json(rows.map(formatJob));
});

router.post("/", async (req, res) => {
  const userId = getUserId(req) ?? 1;

  const schema = z.object({
    title: z.string().min(1),
    company: z.string().min(1),
    location: z.string().optional(),
    status: z.string().default("applied"),
    salary: z.string().optional(),
    url: z.string().optional(),
    notes: z.string().optional(),
    appliedAt: z.string().optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });

  const { appliedAt, ...rest } = parsed.data;
  const [job] = await db.insert(jobsTable).values({
    ...rest,
    userId,
    appliedAt: appliedAt ? new Date(appliedAt) : new Date(),
  }).returning();

  return res.status(201).json(formatJob(job));
});

router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

  const [job] = await db.select().from(jobsTable).where(eq(jobsTable.id, id)).limit(1);
  if (!job) return res.status(404).json({ error: "Job not found" });

  return res.json(formatJob(job));
});

router.patch("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

  const schema = z.object({
    title: z.string().optional(),
    company: z.string().optional(),
    location: z.string().optional(),
    status: z.string().optional(),
    salary: z.string().optional(),
    url: z.string().optional(),
    notes: z.string().optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });

  const [job] = await db.update(jobsTable)
    .set(parsed.data)
    .where(eq(jobsTable.id, id))
    .returning();

  if (!job) return res.status(404).json({ error: "Job not found" });

  return res.json(formatJob(job));
});

router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

  await db.delete(jobsTable).where(eq(jobsTable.id, id));
  return res.json({ message: "Job deleted" });
});

export default router;
