import authMiddleWare, { UserRole } from "@/middleware/authMiddleWare";
import express from "express";
import { postController } from "./post.controller";
const router = express.Router();

router.get(
  "/",
  // authMiddleWare(UserRole.admin, UserRole.user),
  postController.gellAllPost
);
router.post("/", authMiddleWare(UserRole.user), postController.createPost);
export const postRouter = router;
