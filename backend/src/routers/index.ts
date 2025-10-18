import { Router } from "express";
import usersRouter from "./user";
import validationRouter from "./validation";

const appRouter = Router();
// /api/v1/auth

appRouter.use("/user", usersRouter);
appRouter.use("/validation", validationRouter);

export default appRouter;
