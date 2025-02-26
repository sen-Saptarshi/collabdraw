import "express";

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }

  namespace jsonwebtoken {
    interface JwtPayload {
      userId: string;
    }
  }
}

