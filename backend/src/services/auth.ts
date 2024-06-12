import crypto from "crypto";
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../db";
import { FRONTEND_URL, JWT_SECRET } from "../config/constants";
import sendEmail from "../utils/sendEmail";

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

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET);
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

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET);
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

export const forgetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpire = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.user.update({
      where: { email },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpire: resetTokenExpire,
      },
    });
    const resetLink = `${FRONTEND_URL}/reset-password?token=${resetToken}`;
    console.log(resetLink);
    const emailOptions = {
      to: user.email,
      subject: "Password Reset Request",
      htmlFilePath: "./src/templates/reset-password.hbs",
      replacements: {
        subject: "Password Reset Request",
        heading: "Reset Your Password",
        message: "We received a request to reset your password.",
        resetLink,
        senderName: "Your Company Name",
      },
    };
    sendEmail(emailOptions);
    res.status(200).json({ message: "Password reset email sent" });
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token, newPassword } = req.body;
  try {
    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpire: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpire: null,
      },
    });

    res.status(200).json({ message: "Password has been reset" });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
