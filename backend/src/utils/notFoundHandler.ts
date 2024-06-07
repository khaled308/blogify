import { Request, Response, NextFunction } from "express";
import ApiError from "./ApiError";

const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  next(new ApiError("Not Found", 404));
};

export default notFoundHandler;
