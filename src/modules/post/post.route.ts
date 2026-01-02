import { auth } from "@/lib/auth";
import express, { NextFunction, Request, Response } from "express";
import { postController } from "./post.controller";
const router = express.Router();

export enum UserRole {
  user = "user",
  admin = "admin",
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
const authMiddleWare = (...role: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
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
    console.log(session);
    next();
  };
};

router.get("/", authMiddleWare("admin", "user"), postController.gellAllPost);
router.post("/", postController.createPost);
export const postRouter = router;
