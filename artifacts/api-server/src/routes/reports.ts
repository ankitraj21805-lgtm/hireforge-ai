import { Router } from "express";
import { db } from "@workspace/db";
import { reportsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { sessions } from "./auth";

const router = Router();

function getUserId(req: any): number | null {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return null;
  return sessions.get(auth.slice(7)) ?? null;
}

function formatReport(r: typeof reportsTable.$inferSelect) {
  return {
    id: r.id,
    title: r.title,
    type: r.type,
    summary: r.summary,
    metrics: r.metrics ?? {},
    userId: r.userId,
    createdAt: r.createdAt.toISOString(),
  };
}

router.get("/", async (req, res) => {
  const userId = getUserId(req) ?? 1;
  const rows = await db.select().from(reportsTable).where(eq(reportsTable.userId, userId));
  return res.json(rows.map(formatReport));
});

router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

  const [row] = await db.select().from(reportsTable).where(eq(reportsTable.id, id)).limit(1);
  if (!row) return res.status(404).json({ error: "Report not found" });

  return res.json(formatReport(row));
});

export default router;
