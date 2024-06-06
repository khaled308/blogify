import { z } from "zod";
import prisma from "../db";

export const registerSchema = z.object({
  username: z
    .string()
    .min(2)
    .refine(
      async (val) => {
        const user = await prisma.user.findFirst({
          where: { username: val },
        });
        return user === null;
      },
      { message: "username already exist" }
    ),
  email: z
    .string()
    .email()
    .refine(
      async (val) => {
        const user = await prisma.user.findFirst({
          where: { email: val },
        });
        return user === null;
      },
      { message: "email already exist" }
    ),
  password: z.string().min(6),
  gender: z.enum(["MALE", "FEMALE"]),
});
