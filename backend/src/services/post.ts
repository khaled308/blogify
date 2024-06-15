import { NextFunction, Request, Response } from "express";
import prisma from "../db";
import { z } from "zod";
import ApiError from "../utils/ApiError";
import AuthRequestI from "../interfaces/AuthRequestI";

export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, content, image, tags, user } = req.body;
    const post = await prisma.post.create({
      data: {
        title,
        content,
        image,
        authorId: user.id,
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

    const post = await prisma.post.findUnique({
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

    if (!post) throw new ApiError("not found", 404);

    res.send(post);
  } catch (err) {
    res.status(403).send(err);
  }
};

export const deletePost = async (
  req: AuthRequestI,
  res: Response,
  next: NextFunction
) => {
  try {
    const { postId } = req.params;
    z.number().parse(+postId);

    const post = await prisma.post.findUnique({
      where: { id: +postId },
    });

    if (!post) throw new ApiError("not found", 404);

    if (req.user.id != post.authorId && req.user.role != "ADMIN")
      throw new ApiError("not allowed", 403);

    await prisma.post.delete({ where: { id: post.id } });

    res.send({ message: "post deleted successfully" });
  } catch (err) {
    res.status(403).send(err);
  }
};
