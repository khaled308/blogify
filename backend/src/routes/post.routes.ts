import { NextFunction, Request, Response, Router } from "express";
import { isAuthenticated } from "../middlewares/auth";
import {
  createPost,
  disLikePost,
  getPost,
  getPosts,
  likePost,
} from "../services/post";
import validateSchema from "../middlewares/validate";
import { createPostSchema } from "../schemas/post";
import commentRoutes from "./comment.routes";
import AuthRequestI from "../interfaces/AuthRequestI";

const postRoutes = Router();

postRoutes
  .route("/")
  .post(
    isAuthenticated,
    validateSchema(createPostSchema),
    (req: Request, res: Response, next: NextFunction) => {
      createPost(req as AuthRequestI, res, next);
    }
  )
  .get(getPosts);

postRoutes.route("/:postId").get(getPost);

postRoutes.put(
  "/:postId/like",
  isAuthenticated,
  (req: Request, res: Response, next: NextFunction) => {
    likePost(req as AuthRequestI, res, next);
  }
);

postRoutes.put(
  "/:postId/dislike",
  isAuthenticated,
  (req: Request, res: Response, next: NextFunction) => {
    disLikePost(req as AuthRequestI, res, next);
  }
);

postRoutes.use("/:postId/comments/", commentRoutes);

export default postRoutes;
