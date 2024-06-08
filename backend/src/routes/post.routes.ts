import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth";
import { createPost, getPost, getPosts } from "../services/post";
import validateSchema from "../middlewares/validate";
import { createPostSchema } from "../schemas/post";
import commentRoutes from "./comment.routes";

const postRoutes = Router();

postRoutes
  .route("/")
  .post(isAuthenticated, validateSchema(createPostSchema), createPost)
  .get(getPosts);

postRoutes.route("/:postId").get(getPost);
postRoutes.use("/:postId/comments/", commentRoutes);

export default postRoutes;
