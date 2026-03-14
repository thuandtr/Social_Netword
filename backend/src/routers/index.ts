import { Router } from "express";
import usersRouter from "./user";
import validationRouter from "./validation";
import activityRouter from "./activity";
import articleRouter from "./article";

const appRouter = Router();
// /api/v1/auth

appRouter.use("/user", usersRouter);
appRouter.use("/validate", validationRouter);
appRouter.use("/activities", activityRouter);
appRouter.use("/articles", articleRouter);

export default appRouter;
