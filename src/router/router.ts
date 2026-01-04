import { commentRouter } from "@/modules/comment/comment.route";
import { postRouter } from "@/modules/post/post.route";
import { Router } from "express";

const router = Router();

// post route
router.use("/post", postRouter);

// comment route
router.use("/comment", commentRouter);
export default router;
