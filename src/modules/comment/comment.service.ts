import { prisma } from "@/lib/prisma";

// create comment
const createComment = async (payload: {
  content: string;
  authorId: string;
  postId: string;
  parentId: string;
}) => {
  // check post exsit or not and throw error
  await prisma.post.findUniqueOrThrow({
    where: {
      id: payload.postId,
    },
  });

  //   check comment for replay exsit or not and throw error
  await prisma.comment.findUniqueOrThrow({
    where: {
      id: payload.parentId,
    },
  });
  const result = await prisma.comment.create({
    data: payload,
  });
  return result;
};

// get comment by id
const getCommentById = async (id: string) => {
  const result = await prisma.comment.findUnique({
    where: {
      id,
    },
    include: {
      post: {
        select: {
          id: true,
          title: true,
          views: true,
        },
      },
    },
  });
  return result;
};

// get comment by  author id
const getCommentByAuthorId = async (id: string) => {
  const result = await prisma.comment.findMany({
    where: {
      authorId: id,
    },
    include: {
      post: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
  return result;
};

// delete comment
const deleteComment = async (id: string, authorId: string) => {
  const commentData = await prisma.comment.findFirst({
    where: {
      id,
      authorId,
    },
    select: {
      id: true,
    },
  });
  if (!commentData) {
    throw new Error("Something went wrong");
  }

  const result = await prisma.comment.delete({
    where: {
      id: commentData.id,
    },
  });
  return result;
};
export const commentService = {
  createComment,
  getCommentById,
  getCommentByAuthorId,
  deleteComment,
};
