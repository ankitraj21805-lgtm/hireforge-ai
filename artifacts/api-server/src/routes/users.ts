import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { z } from "zod/v4";

const router = Router();

function formatUser(u: typeof usersTable.$inferSelect) {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    avatarUrl: u.avatarUrl,
    company: u.company,
    title: u.title,
    createdAt: u.createdAt.toISOString(),
  };
}

router.get("/", async (_req, res) => {
  const users = await db.select().from(usersTable).orderBy(usersTable.createdAt);
  return res.json(users.map(formatUser));
});

router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, id)).limit(1);
  if (!user) return res.status(404).json({ error: "User not found" });

  return res.json(formatUser(user));
});

router.patch("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

  const schema = z.object({
    name: z.string().optional(),
    company: z.string().optional(),
    title: z.string().optional(),
    avatarUrl: z.string().optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });

  const [user] = await db.update(usersTable)
    .set(parsed.data)
    .where(eq(usersTable.id, id))
    .returning();

  if (!user) return res.status(404).json({ error: "User not found" });

  return res.json(formatUser(user));
});

router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

  await db.delete(usersTable).where(eq(usersTable.id, id));
  return res.json({ message: "User deleted" });
});

export default router;
