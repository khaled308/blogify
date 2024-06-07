import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth";
import { getProfile } from "../services/profile";

const profileRoutes = Router();

profileRoutes.get("/:userId", isAuthenticated, getProfile);

export default profileRoutes;
