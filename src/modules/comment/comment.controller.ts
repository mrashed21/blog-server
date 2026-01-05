import { Request, Response } from "express";
import { commentService } from "./comment.service";

// create comment
const createComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    req.body.authorId = user?.id;
    const result = await commentService.createComment(req.body);

    res.status(201).json({
      success: true,
      message: "Successfuly added comment",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong! try again.",
    });
  }
};

//  get comment by id
const getCommentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await commentService.getCommentById(id!);
    res.status(200).json({
      success: true,
      message: "Comment Get successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
      error: error,
    });
  }
};

//  get comment by author id
const getCommentByAuthorId = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await commentService.getCommentByAuthorId(id!);
    res.status(200).json({
      success: true,
      message: "Comment Get successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
      error: error,
    });
  }
};

// delete comment
const deleteComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user;
    const result = await commentService.deleteComment(id!, user?.id!);
    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
      error: error,
    });
  }
};
export const commentController = {
  createComment,
  getCommentById,
  getCommentByAuthorId,
  deleteComment,
};
