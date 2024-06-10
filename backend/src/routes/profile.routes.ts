import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth";
import {
  blockUser,
  followUser,
  getProfile,
  unblockUser,
  unfollowUser,
} from "../services/profile";

const profileRoutes = Router();

profileRoutes.get("/:userId", isAuthenticated, getProfile);
profileRoutes.put("/:userId/block", isAuthenticated, blockUser);
profileRoutes.put("/:userId/unblock", isAuthenticated, unblockUser);
profileRoutes.put("/:userId/follow", isAuthenticated, followUser);
profileRoutes.put("/:userId/unfollow", isAuthenticated, unfollowUser);

export default profileRoutes;
