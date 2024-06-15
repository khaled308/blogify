import { NextFunction, Request, Response, Router } from "express";
import { isAuthenticated } from "../middlewares/auth";
import { createComment, deleteComment } from "../services/comment";
import AuthRequestI from "../interfaces/AuthRequestI";

const commentRoutes = Router({ mergeParams: true });

commentRoutes.post("/", isAuthenticated, createComment);
commentRoutes.delete(
  "/:commentId",
  isAuthenticated,
  (req: Request, res: Response, next: NextFunction) => {
    deleteComment(req as AuthRequestI, res, next);
  }
);

export default commentRoutes;
