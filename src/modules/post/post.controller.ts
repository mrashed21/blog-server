import type { Request, Response } from "express";
import { postService } from "./post.service";

const createPost = async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    return res.status(500).json({
      success: false,
      message: "Unauthorized",
    });
  }
  try {
    const result = await postService.createPost(req.body, user?.id!);

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create post",
    });
  }
};

const gellAllPost = async (req: Request, res: Response) => {
  try {
    const result = await postService.gellAllPost();

    res.status(200).json({
      success: true,
      message: "Post get successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get post",
    });
  }
};
export const postController = {
  createPost,
  gellAllPost,
};
