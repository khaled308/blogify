import { NextFunction, Request, Response } from "express";
import prisma from "../db";

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: +userId },
      include: {
        followers: true,
        following: true,
      },
    });

    if (!user) return res.status(404).send({ message: "User not found" });

    return res.send(user);
  } catch (err) {
    next(err);
  }
};

export const blockUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId: blockedId } = req.params;
    const { user } = req.body;

    if (blockedId == user.id)
      return res.status(403).send({ message: "You can not block yourself" });

    const blockedUser = await prisma.user.findUnique({
      where: { id: +blockedId },
    });

    if (!blockedUser)
      return res.status(404).send({ message: "user mot found" });

    const blockedUserExist = await prisma.block.findFirst({
      where: { blockedId: +blockedId, blockerId: user.id },
    });

    if (blockedUserExist)
      return res.status(403).send({ message: "You already blocked this user" });

    await prisma.block.create({
      data: {
        blockerId: +user.id,
        blockedId: +blockedId,
      },
    });

    res.send({ message: "user blocked successfully" });
  } catch (err) {
    next(err);
  }
};

export const unblockUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId: blockedId } = req.params;
    const { user } = req.body;
    const blockedUser = await prisma.block.findFirst({
      where: { blockedId: +blockedId, blockerId: user.id },
    });

    if (!blockedUser)
      return res.status(404).send({ message: "user mot found" });

    await prisma.block.deleteMany({
      where: {
        blockerId: +user.id,
        blockedId: +blockedId,
      },
    });

    res.send({ message: "user unblocked successfully" });
  } catch (err) {
    next(err);
  }
};

export const followUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const { user } = req.body;

    if (userId == user.id)
      return res.status(403).send({ message: "You can not follow yourself" });

    const followerUser = await prisma.user.findUnique({
      where: { id: +userId },
    });

    if (!followerUser)
      return res.status(404).send({ message: "user mot found" });

    const followerUserExist = await prisma.follows.findFirst({
      where: {
        followerId: user.id,
        followingId: +userId,
      },
    });

    if (followerUserExist)
      return res.status(403).send({ message: "you already follow user" });

    await prisma.follows.create({
      data: {
        followerId: user.id,
        followingId: +userId,
      },
    });

    res.send({ message: "you follow user successfully" });
  } catch (err) {
    next(err);
  }
};

export const unfollowUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const { user } = req.body;
    const followingUser = await prisma.follows.findFirst({
      where: { followingId: +userId, followerId: user.id },
    });

    if (!followingUser)
      return res.status(404).send({ message: "user mot found" });

    await prisma.follows.deleteMany({
      where: {
        followerId: +user.id,
        followingId: +userId,
      },
    });

    res.send({ message: "user unfollow successfully" });
  } catch (err) {
    next(err);
  }
};
