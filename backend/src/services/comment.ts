import { NextFunction, Request, Response } from "express";
import prisma from "../db";
import { z } from "zod";

export const createComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { postId } = req.params;
    const { content, userId } = req.body;

    z.number().parse(+postId);
    z.string().min(5).max(130).parse(content);

    const comment = await prisma.comment.create({
      data: {
        content,
        postId: +postId,
        authorId: userId,
      },
    });

    res.send(comment);
  } catch (err) {
    res.status(403).send(err);
  }
};
