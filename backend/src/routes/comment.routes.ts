import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth";
import { createComment } from "../services/comment";

const commentRoutes = Router({ mergeParams: true });

commentRoutes.post("/", isAuthenticated, createComment);

export default commentRoutes;
