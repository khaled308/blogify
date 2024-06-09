import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth";
import { createComment, deleteComment } from "../services/comment";

const commentRoutes = Router({ mergeParams: true });

commentRoutes.post("/", isAuthenticated, createComment);
commentRoutes.delete("/:commentId", isAuthenticated, deleteComment);

export default commentRoutes;
