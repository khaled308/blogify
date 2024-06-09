import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../config/constants";

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token?.split(" ")[1];

    if (!token) return res.status(403).send({ message: "you are not allowed" });
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.body.user = { id: decoded.userId, role: decoded.role };
    next();
  } catch (err) {
    return res.status(403).send({ message: "you are not allowed" });
  }
};
