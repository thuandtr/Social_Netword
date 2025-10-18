import { Router } from "express";
import * as usersHandler from "../handlers/user-handler";

const usersRouter = Router();
// /api/v1/auth/user

usersRouter.get("/:id", usersHandler.getUser);
usersRouter.post("/new", usersHandler.createUser);

export default usersRouter;