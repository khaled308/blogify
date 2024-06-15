import { NextFunction, Request, Response } from "express";
import prisma from "../db";
import { z } from "zod";
import ApiError from "../utils/ApiError";
import AuthRequestI from "../interfaces/AuthRequestI";

export const createPost = async (
  req: AuthRequestI,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, content, image, tags } = req.body;
    const post = await prisma.post.create({
      data: {
        title,
        content,
        image,
        authorId: req.user.id,
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
      include: {
        author: { select: { id: true, username: true } },
        tags: true,
        likes: {
          select: { user: { select: { id: true, username: true } } },
        },
        dislikes: {
          select: { user: { select: { id: true, username: true } } },
        },
      },
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

export const likePost = async (
  req: AuthRequestI,
  res: Response,
  next: NextFunction
) => {
  try {
    const { postId } = req.params;

    const post = await prisma.post.findUnique({
      where: { id: +postId },
    });

    if (!post) return res.status(404).send({ message: "Post Not Found" });

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          postId: +postId,
          userId: req.user.id,
        },
      },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: {
          userId_postId: {
            postId: +postId,
            userId: req.user.id,
          },
        },
      });
      return res.status(200).send({ message: "Post unliked successfully" });
    }

    await prisma.like.create({
      data: {
        postId: +postId,
        userId: req.user.id,
      },
    });
    return res.status(200).send({ message: "Post liked successfully" });
  } catch (err) {
    next(err);
  }
};

export const disLikePost = async (
  req: AuthRequestI,
  res: Response,
  next: NextFunction
) => {
  try {
    const { postId } = req.params;

    const post = await prisma.post.findUnique({
      where: { id: +postId },
    });

    if (!post) return res.status(404).send({ message: "Post Not Found" });

    const existingDislike = await prisma.disLike.findUnique({
      where: {
        userId_postId: {
          postId: +postId,
          userId: req.user.id,
        },
      },
    });

    if (existingDislike) {
      await prisma.disLike.delete({
        where: {
          userId_postId: {
            postId: +postId,
            userId: req.user.id,
          },
        },
      });
      return res
        .status(200)
        .send({ message: "Post  dislike removed successfully" });
    }

    await prisma.disLike.create({
      data: {
        postId: +postId,
        userId: req.user.id,
      },
    });
    return res.status(200).send({ message: "Post disliked successfully" });
  } catch (err) {
    next(err);
  }
};
