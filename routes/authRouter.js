import express from "express";
import validateBody from "../helpers/validateBody.js";
import { registerSchema, loginSchema } from "../schemas/userSchemas.js";
import {
  register,
  login,
  logout,
  getCurrent,
} from "../controllers/authControllers.js";
import auth from "../helpers/auth.js";

const userRouter = express.Router();
// const jsonParcer = express.json();

userRouter.post("/register", validateBody(registerSchema), register);
userRouter.post("/login", validateBody(loginSchema), login);
userRouter.get("/logout", auth, logout);
userRouter.get("/current", auth, getCurrent);

export default userRouter;
