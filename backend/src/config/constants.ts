import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT ?? 8000;
export const JWT_SECRET = process.env.JWT_SECRET as string;
export const NODE_ENV = process.env.NODE_ENV as string;
export const MAIL_HOST = process.env.MAIL_HOST as string;
export const MAIL_PORT = process.env.MAIL_PORT as unknown as number;
export const MAIL_USER = process.env.MAIL_USER as string;
export const MAIL_PASSWORD = process.env.MAIL_PASSWORD as string;
export const MAIL_ENCRYPTION = process.env.MAIL_ENCRYPTION as string;
