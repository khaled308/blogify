import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth";
import { blockUser, getProfile, unblockUser } from "../services/profile";

const profileRoutes = Router();

profileRoutes.get("/:userId", isAuthenticated, getProfile);
profileRoutes.put("/:userId/block", isAuthenticated, blockUser);
profileRoutes.put("/:userId/unblock", isAuthenticated, unblockUser);

export default profileRoutes;
