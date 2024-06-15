import { NextFunction, Request, Response, Router } from "express";
import {
  forgetPassword,
  login,
  register,
  resetPassword,
  sendEmailVerificationToken,
  verifyEmail,
} from "../services/auth";
import validateSchema from "../middlewares/validate";
import { registerSchema } from "../schemas/user";
import { isAuthenticated } from "../middlewares/auth";
import AuthRequestI from "../interfaces/AuthRequestI";

const authRoutes = Router();

authRoutes.post("/register", validateSchema(registerSchema), register);
authRoutes.post("/login", login);
authRoutes.put("/forget-password", forgetPassword);
authRoutes.put("/reset-password", resetPassword);
authRoutes.put(
  "/verify-email-token",
  isAuthenticated,
  (req: Request, res: Response, next: NextFunction) => {
    sendEmailVerificationToken(req as AuthRequestI, res, next);
  }
);
authRoutes.put("/verify-email", isAuthenticated, verifyEmail);

export default authRoutes;
