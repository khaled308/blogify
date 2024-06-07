import { NextFunction, Request, Response } from "express";
import ApiError from "./ApiError";
import { NODE_ENV } from "../config/constants";

const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { status = 500, message = "something wrong" } = err;
  res
    .status(status)
    .send({
      message: message,
      ...(NODE_ENV == "development" && { stack: err.stack }),
    });
};

export default errorHandler;
