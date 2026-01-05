import authMiddleWare, { UserRole } from "@/middleware/authMiddleWare";
import express from "express";
import { commentController } from "./comment.controller";

const router = express.Router();

// get comment by Id
router.get("/:id", commentController.getCommentById);
// create comment
router.post(
  "/",
  authMiddleWare(UserRole.user, UserRole.admin),
  commentController.createComment
);

export const commentRouter = router;
