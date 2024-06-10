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
    });

    if (!user) return res.status(404).send({ message: "user mot found" });

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
      return res.send({ message: "You already blocked this user" });

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
