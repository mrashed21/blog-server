import express from "express";
import { commentController } from "./comment.controller";

const router = express.Router();

// create comment
router.post("/", commentController.createComment);

export const commentRouter = router;
