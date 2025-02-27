import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

export function middleware(req: Request, res: Response, next: NextFunction) {
  const token: string = req.headers["authorization"] ?? "";
  const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload & {
    userId?: string;
  };
  if (decoded) {
    (req as any).userId = decoded.userId!;
  } else {
    res.status(403).json({
      message: "Unauthorized",
    });
  }
  next();
}
