import { pgTable, text, serial, integer, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const githubAnalysesTable = pgTable("github_analyses", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  score: integer("score").notNull().default(0),
  repoCount: integer("repo_count").notNull().default(0),
  commitScore: integer("commit_score").notNull().default(0),
  topLanguages: json("top_languages").$type<string[]>().default([]),
  summary: text("summary"),
  strengths: json("strengths").$type<string[]>().default([]),
  userId: integer("user_id").notNull(),
  analyzedAt: timestamp("analyzed_at").notNull().defaultNow(),
});

export const insertGithubAnalysisSchema = createInsertSchema(githubAnalysesTable).omit({ id: true, analyzedAt: true });
export type InsertGithubAnalysis = z.infer<typeof insertGithubAnalysisSchema>;
export type GithubAnalysis = typeof githubAnalysesTable.$inferSelect;
