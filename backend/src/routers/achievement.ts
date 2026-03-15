import { Router } from "express";
import { getCompanyAchievements } from "../handlers/achievement-handler";

const achievementRouter = Router();

// Public route (no auth required)
achievementRouter.get("/", getCompanyAchievements);

export default achievementRouter;
