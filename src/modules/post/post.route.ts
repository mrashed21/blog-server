import authMiddleWare, { UserRole } from "@/middleware/authMiddleWare";
import express from "express";
import { postController } from "./post.controller";
const router = express.Router();

// get myposts
router.get(
  "/myposts",
  authMiddleWare(UserRole.admin, UserRole.user),
  postController.getMyPosts
);

// get all post
router.get("/", postController.gellAllPost);

// get post by id
router.get("/:postId", postController.getPostById);

// create post
router.post("/", authMiddleWare(UserRole.user), postController.createPost);

// update mypost
router.patch(
  "/:postId",
  authMiddleWare(UserRole.user, UserRole.admin),
  postController.updateMyPost
);
export const postRouter = router;
