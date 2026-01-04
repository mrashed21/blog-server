import { prisma } from "@/lib/prisma";

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

export const commentService = {
  createComment,
};
