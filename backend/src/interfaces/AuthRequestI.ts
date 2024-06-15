import { Request } from "express";

interface AuthRequestI extends Request {
  user: {
    id: number;
    role: "ADMIN" | "USER";
  };
}

export default AuthRequestI;
