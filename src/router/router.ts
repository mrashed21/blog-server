import { postRouter } from "@/modules/post/post.route";
import { Router } from "express";

const router = Router();
// post route

router.use("/post", postRouter);
export default router;
