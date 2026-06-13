import { pgTable, text, serial, integer, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const resumesTable = pgTable("resumes", {
  id: serial("id").primaryKey(),
  fileName: text("file_name").notNull(),
  score: integer("score").notNull().default(0),
  summary: text("summary"),
  skills: json("skills").$type<string[]>().default([]),
  experience: json("experience").$type<string[]>().default([]),
  improvements: json("improvements").$type<string[]>().default([]),
  userId: integer("user_id").notNull(),
  analyzedAt: timestamp("analyzed_at").notNull().defaultNow(),
});

export const insertResumeSchema = createInsertSchema(resumesTable).omit({ id: true, analyzedAt: true });
export type InsertResume = z.infer<typeof insertResumeSchema>;
export type Resume = typeof resumesTable.$inferSelect;
