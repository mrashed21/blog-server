import { auth } from "@/lib/auth";
import express, { NextFunction, Request, Response } from "express";
import { postController } from "./post.controller";
const router = express.Router();

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
    console.log(session);
    next();
  };
};

router.get("/", authMiddleWare("admin", "user"), postController.gellAllPost);
router.post("/", postController.createPost);
export const postRouter = router;
