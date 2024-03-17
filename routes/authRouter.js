import express from "express";
import validateBody from "../helpers/validateBody.js";
import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
} from "../schemas/userSchemas.js";
import {
  register,
  login,
  logout,
  getCurrent,
  verify,
  resendVerifyEmail,
} from "../controllers/authControllers.js";
import { uploadAvatar, getAvatar } from "../controllers/userController.js";
import auth from "../helpers/auth.js";
import upload from "../helpers/upload.js";

const userRouter = express.Router();
// const jsonParcer = express.json();

userRouter.post("/register", validateBody(registerSchema), register);
userRouter.post("/login", validateBody(loginSchema), login);
userRouter.get("/logout", auth, logout);
userRouter.get("/current", auth, getCurrent);
userRouter.get("/avatars", auth, getAvatar);
userRouter.patch("/avatars", auth, upload.single("avatar"), uploadAvatar);
userRouter.get("/verify/:verificationToken", verify);
userRouter.post("/verify", validateBody(verifyEmailSchema), resendVerifyEmail);

export default userRouter;
