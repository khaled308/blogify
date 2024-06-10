import { NextFunction, Request, Response } from "express";
import prisma from "../db";

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    // there is bug here, database structure
    const user = await prisma.user.findUnique({
      where: { id: +userId },
      include: {
        followers: {
          select: { following: { select: { username: true, id: true } } },
        },
        following: {
          select: { follower: { select: { username: true, id: true } } },
        },
      },
    });

    if (!user) return res.status(404).send({ message: "User not found" });

    const transformedUser = {
      ...user,
      followers: user.followers.map((f) => ({
        id: f.following.id,
        username: f.following.username,
      })),
      following: user.following.map((f) => ({
        id: f.follower.id,
        username: f.follower.username,
      })),
    };

    return res.send(transformedUser);
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
    const { userId: followingId } = req.params;
    const { user } = req.body;

    if (followingId == user.id)
      return res.status(403).send({ message: "You can not follow yourself" });

    const followingUser = await prisma.user.findUnique({
      where: { id: +followingId },
    });

    if (!followingUser)
      return res.status(404).send({ message: "user mot found" });

    const followerUserExist = await prisma.follows.findFirst({
      where: {
        followerId: user.id,
        followingId: +followingId,
      },
    });

    if (followerUserExist)
      return res.status(403).send({ message: "you already follow user" });

    await prisma.follows.create({
      data: {
        followerId: user.id,
        followingId: +followingId,
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
