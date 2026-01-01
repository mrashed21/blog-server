import { auth } from "@/lib/auth";
import express, { NextFunction, Request, Response } from "express";
import { postController } from "./post.controller";
const router = express.Router();

const authMiddleWare = (...role: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const session = await auth.api.getSession({
      headers: req.headers as any,
    });

    console.log(session);
    next();
  };
};

router.get("/", authMiddleWare("admin", "user"), postController.gellAllPost);
router.post("/", postController.createPost);
export const postRouter = router;
