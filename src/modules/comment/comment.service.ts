import { prisma } from "@/lib/prisma";
import { CommnetStatus } from "@generated/prisma/enums";

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
  if (payload.parentId) {
    await prisma.comment.findUniqueOrThrow({
      where: {
        id: payload.parentId,
      },
    });
  }
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

// update comment
const updateComment = async (
  id: string,
  authorId: string,
  payload: {
    content?: string;
    status?: CommnetStatus;
  }
) => {
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

  const result = await prisma.comment.update({
    where: {
      id: commentData.id,
    },
    data: payload,
  });
  return result;
};

// modify comment by admin
const modifyCommentByAdmin = async (
  id: string,
  data: { status: CommnetStatus }
) => {
  const modifyComent = await prisma.comment.findUniqueOrThrow({
    where: {
      id,
    },
  });

  if (modifyComent.status === data.status) {
    throw new Error(`Your Comment Status (${data.status}) already up to date`);
  }
  const result = prisma.comment.update({
    where: {
      id: modifyComent.id,
    },
    data,
  });
  return result;
};
export const commentService = {
  createComment,
  getCommentById,
  getCommentByAuthorId,
  deleteComment,
  updateComment,
  modifyCommentByAdmin,
};
