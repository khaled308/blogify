import { NextFunction, Request, Response, Router } from "express";
import { isAuthenticated } from "../middlewares/auth";
import {
  blockUser,
  followUser,
  getProfile,
  unblockUser,
  unfollowUser,
} from "../services/profile";
import AuthRequestI from "../interfaces/AuthRequestI";

const profileRoutes = Router();

profileRoutes.get("/:userId", isAuthenticated, getProfile);
profileRoutes.put(
  "/:userId/block",
  isAuthenticated,
  (req: Request, res: Response, next: NextFunction) => {
    blockUser(req as AuthRequestI, res, next);
  }
);
profileRoutes.put(
  "/:userId/unblock",
  isAuthenticated,
  (req: Request, res: Response, next: NextFunction) => {
    unblockUser(req as AuthRequestI, res, next);
  }
);
profileRoutes.put(
  "/:userId/follow",
  isAuthenticated,
  (req: Request, res: Response, next: NextFunction) => {
    followUser(req as AuthRequestI, res, next);
  }
);
profileRoutes.put(
  "/:userId/unfollow",
  isAuthenticated,
  (req: Request, res: Response, next: NextFunction) => {
    unfollowUser(req as AuthRequestI, res, next);
  }
);

export default profileRoutes;
