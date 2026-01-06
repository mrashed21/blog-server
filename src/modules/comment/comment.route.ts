import authMiddleWare, { UserRole } from "@/middleware/authMiddleWare";
import express from "express";
import { commentController } from "./comment.controller";

const router = express.Router();

// get comment by Id
router.get("/:id", commentController.getCommentById);
// get comment by author Id
router.get("/author/:id", commentController.getCommentByAuthorId);
// create comment
router.post(
  "/",
  authMiddleWare(UserRole.user, UserRole.admin),
  commentController.createComment
);
// delete comment
router.delete(
  "/:id",
  authMiddleWare(UserRole.user, UserRole.admin),
  commentController.deleteComment
);

// update comment
router.patch(
  "/:id",
  authMiddleWare(UserRole.user, UserRole.admin),
  commentController.updateComment
);

router.patch(
  "/modify/:id",
  authMiddleWare(UserRole.admin),
  commentController.modifyCommentByAdmin
);
// modify comment by admin,

export const commentRouter = router;
