import { NextFunction, Request, Response } from "express";
import prisma from "../db";
import { z } from "zod";

export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, content, image, tags, userId } = req.body;
    const post = await prisma.post.create({
      data: {
        title,
        content,
        image,
        authorId: userId,
        tags: {
          connectOrCreate: tags.map((tagName: string) => ({
            create: { name: tagName },
            where: { name: tagName },
          })),
        },
      },
      include: {
        author: {
          select: { id: true, username: true },
        },
        tags: true,
      },
    });

    res.send(post);
  } catch (err) {
    next(err);
  }
};

export const getPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const posts = await prisma.post.findMany({
      include: { author: { select: { id: true, username: true } }, tags: true },
    });

    res.send(posts);
  } catch (err) {
    next(err);
  }
};

export const getPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { postId } = req.params;
    z.number().parse(+postId);

    const posts = await prisma.post.findUnique({
      where: { id: +postId },
      include: {
        author: { select: { id: true, username: true } },
        tags: true,
        comments: {
          select: {
            id: true,
            author: { select: { id: true, username: true } },
            content: true,
          },
        },
        likes: true,
        dislikes: true,
      },
    });

    res.send(posts);
  } catch (err) {
    res.status(403).send(err);
  }
};
