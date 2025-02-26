import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SSECRET } from "./config";

export function middleware(req: Request, res: Response, next: NextFunction) {
  const token: string = req.headers["authorization"] ?? "";
  const decoded = jwt.verify(token, JWT_SSECRET) as JwtPayload & {
    userId?: string;
  };
  if (decoded) {
    req.userId = decoded.userId!;
  } else {
    res.status(403).json({
      message: "Unauthorized",
    });
  }
  next();
}
