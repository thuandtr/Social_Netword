import { Router } from "express";
import usersRouter from "./user";
import validationRouter from "./validation";
import oauthRouter from "./oauth";
import activityRouter from "./activity";

const appRouter = Router();
// /api/v1/auth

appRouter.use("/user", usersRouter);
appRouter.use("/validate", validationRouter);
appRouter.use("/activities", activityRouter);
appRouter.use("/", oauthRouter); // OAuth routes: /google, /google/callback

export default appRouter;
