import { NextFunction, Request, Response } from "express";
import prisma from "../db";
import { z } from "zod";
import ApiError from "../utils/ApiError";
import AuthRequestI from "../interfaces/AuthRequestI";

export const createComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { postId } = req.params;
    const { content, user } = req.body;

    z.number().parse(+postId);
    z.string().min(5).max(130).parse(content);

    const comment = await prisma.comment.create({
      data: {
        content,
        postId: +postId,
        authorId: user.id,
      },
    });

    res.send(comment);
  } catch (err) {
    res.status(403).send(err);
  }
};

export const deleteComment = async (
  req: AuthRequestI,
  res: Response,
  next: NextFunction
) => {
  try {
    const { commentId, postId } = req.params;
    z.number().parse(+postId);
    z.number().parse(+commentId);
    const comment = await prisma.comment.findUnique({
      where: { id: +commentId },
      include: {
        author: { select: { id: true, role: true } },
        post: { select: { author: { select: { id: true } } } },
      },
    });
    if (!comment) throw new ApiError("Not Found", 404);

    if (
      comment.authorId != +req.user.id &&
      comment.post.author.id != +req.user.id &&
      req.user.role != "ADMIN"
    )
      throw new ApiError("Not allowed", 403);

    await prisma.comment.delete({ where: { id: comment.id } });

    res.send({ message: "deleted successfully" });
  } catch (err) {
    res.status(404).send({ message: "Not Found" });
  }
};
