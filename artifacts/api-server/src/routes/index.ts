import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import usersRouter from "./users";
import jobsRouter from "./jobs";
import resumesRouter from "./resumes";
import githubRouter from "./github";
import reportsRouter from "./reports";
import dashboardRouter from "./dashboard";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/jobs", jobsRouter);
router.use("/resumes", resumesRouter);
router.use("/github", githubRouter);
router.use("/reports", reportsRouter);
router.use("/dashboard", dashboardRouter);
router.use("/admin", adminRouter);

export default router;
