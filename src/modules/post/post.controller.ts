import paginationSortFun from "@/helpers/paginationSortFunc";
import { PostStatus } from "@generated/prisma/enums";
import type { Request, Response } from "express";
import { postService } from "./post.service";

// cretate post
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

// get all post
const gellAllPost = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const searchTerm = typeof search === "string" ? search : undefined;
    const tags = req.query.tags ? (req.query.tags as string).split(",") : [];

    const isFeatured =
      req.query.isFeatured === "true"
        ? true
        : req.query.isFeatured === "false"
        ? false
        : undefined;

    const status = req.query.status as PostStatus | undefined;
    const authorId = req.query.authorId as string | undefined;

    const { page, limit, skip, sortBy, sortOrder } = paginationSortFun(
      req.query
    );

    const result = await postService.gellAllPost({
      search: searchTerm,
      tags,
      isFeatured,
      status,
      authorId,
      page,
      limit,
      skip,
      sortBy,
      sortOrder,
    });

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

// get post by id
const getPostById = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    if (!postId) {
      throw new Error("Post Id is required");
    }
    const result = await postService.getPostById(postId);
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

// get myposts
const getMyPosts = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    console.log(user);
    const result = await postService.getMyPosts(user?.id!);
    res.status(200).json({
      success: true,
      message: "posts get successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "something went wrong! try again",
    });
  }
};
export const postController = {
  createPost,
  gellAllPost,
  getPostById,
  getMyPosts,
};
