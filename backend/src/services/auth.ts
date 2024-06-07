import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../db";
import { JWT_SECRET } from "../config/constants";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, email, password, gender } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        gender,
      },
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    res.cookie("token", `Barer ${token}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 5 * 24 * 60 * 60 * 1000,
    });

    res.send(user);
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user)
      return res.status(400).send({ message: "email or password not correct" });

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword)
      return res.status(400).send({ message: "email or password not correct" });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    res.cookie("token", `Barer ${token}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 5 * 24 * 60 * 60 * 1000,
    });

    res.send(user);
  } catch (error) {
    next(error);
  }
};
