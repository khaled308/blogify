import { Router } from "express";
import { login, register } from "../services/auth";
import validateSchema from "../middlewares/validate";
import { registerSchema } from "../schemas/user";

const authRoutes = Router();

authRoutes.post("/register", validateSchema(registerSchema), register);
authRoutes.post("/login", login);

export default authRoutes;
