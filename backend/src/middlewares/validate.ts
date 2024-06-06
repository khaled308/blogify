import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

const validateSchema = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.log(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };
};

export default validateSchema;
