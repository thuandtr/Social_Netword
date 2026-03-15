import { Router } from "express";
import usersRouter from "./user";
import validationRouter from "./validation";
import activityRouter from "./activity";
import articleRouter from "./article";
import achievementRouter from "./achievement";

const appRouter = Router();
// /api/v1/auth

appRouter.use("/user", usersRouter);
appRouter.use("/validate", validationRouter);
appRouter.use("/activities", activityRouter);
appRouter.use("/articles", articleRouter);
appRouter.use("/achievements", achievementRouter);

export default appRouter;
