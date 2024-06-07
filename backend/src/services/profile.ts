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
