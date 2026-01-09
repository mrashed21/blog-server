import paginationSortFun from "@/helpers/paginationSortFunc";
import { UserRole } from "@/middleware/authMiddleWare";
import { PostStatus } from "@generated/prisma/enums";
import type { NextFunction, Request, Response } from "express";
import { postService } from "./post.service";

// cretate post
const createPost = async (req: Request, res: Response, next: NextFunction) => {
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
    // res.status(500).json({
    //   success: false,
    //   message: "Failed to create post",
    // });
    next(error);
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

// update mypost
const updateMyPost = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    const isAdmin = user?.role === UserRole.admin;
    if (!user) {
      throw new Error("You are unauthorized");
    }
    const { postId } = req.params;
    const result = await postService.updateMyPost(
      user.id!,
      postId!,
      req.body!,
      isAdmin
    );
    res.status(201).json({
      success: true,
      message: "Post update successfull",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "something went wrong! try again",
    });
  }
};

// delete post
const deletePost = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    const isAdmin = user?.role === UserRole.admin;
    if (!user) {
      throw new Error("You are unauthorized");
    }
    const { postId } = req.params;
    const result = await postService.deletePost(postId!, user.id!, isAdmin);
    res.status(201).json({
      success: true,
      message: "Post delete successfull",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "something went wrong! try again",
    });
  }
};

// stats
const stats = async (req: Request, res: Response) => {
  try {
    const result = await postService.stats();
    res.status(200).json({
      success: true,
      message: "Stats get successfull",
      data: result,
    });
  } catch (error) {
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
  updateMyPost,
  deletePost,
  stats,
};
