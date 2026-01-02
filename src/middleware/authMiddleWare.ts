import { auth } from "@/lib/auth";
import { NextFunction, Request, Response } from "express";

export enum UserRole {
  admin = "admin",
  user = "user",
}
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        role: string;
        emailVerified: boolean;
      };
    }
  }
}

//* aurh middleware
const authMiddleWare = (...role: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await auth.api.getSession({
        headers: req.headers as any,
      });

      if (!session) {
        return res.status(401).json({
          success: false,
          message: "You are not Authorized",
        });
      }

      if (!session.user.emailVerified) {
        return res.status(403).json({
          success: false,
          message: "Email is not verified",
        });
      }

      req.user = {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role!,
        emailVerified: session.user.emailVerified,
      };

      console.log("console form auth :", req.user);

      if (role.length && !role.includes(req.user.role as UserRole)) {
        return res.status(403).json({
          success: false,
          message: "Forbiden! You dont have access",
        });
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};

export default authMiddleWare;
