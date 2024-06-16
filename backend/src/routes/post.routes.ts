import { NextFunction, Request, Response, Router } from "express";
import multer from "multer";
import { isAuthenticated } from "../middlewares/auth";
import {
  createPost,
  deletePost,
  disLikePost,
  getPost,
  getPosts,
  likePost,
  togglePostView,
} from "../services/post";
import { createPostSchema } from "../schemas/post";
import commentRoutes from "./comment.routes";
import AuthRequestI from "../interfaces/AuthRequestI";

const postRoutes = Router();
const upload = multer({ storage: multer.memoryStorage() });

postRoutes
  .route("/")
  .post(
    isAuthenticated,
    upload.single("image"),
    (req: Request, res: Response, next: NextFunction) => {
      const validation = createPostSchema.safeParse({
        ...req.body,
        image: req.file,
      });
      // return res.send({
      //   ...req.body,
      //   image: req.file,
      // });
      if (!validation.success) {
        return res.status(400).json({ error: validation.error.errors });
      }
      createPost(req as AuthRequestI, res, next);
    }
  )
  .get(getPosts);

postRoutes
  .route("/:postId")
  .get(getPost)
  .delete(
    isAuthenticated,
    (req: Request, res: Response, next: NextFunction) => {
      deletePost(req as AuthRequestI, res, next);
    }
  );

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

postRoutes.put(
  "/:postId/toggle-view",
  isAuthenticated,
  (req: Request, res: Response, next: NextFunction) => {
    togglePostView(req as AuthRequestI, res, next);
  }
);

postRoutes.use("/:postId/comments/", commentRoutes);

export default postRoutes;
