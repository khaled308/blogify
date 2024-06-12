import { Router } from "express";
import {
  forgetPassword,
  login,
  register,
  resetPassword,
} from "../services/auth";
import validateSchema from "../middlewares/validate";
import { registerSchema } from "../schemas/user";

const authRoutes = Router();

authRoutes.post("/register", validateSchema(registerSchema), register);
authRoutes.post("/login", login);
authRoutes.post("/forget-password", forgetPassword);
authRoutes.post("/reset-password", resetPassword);

export default authRoutes;
