import { prisma } from "@/lib/prisma";
import type { Post } from "@generated/prisma/client";

const createPost = async (
  data: Omit<Post, "id" | "createdAt" | "updatedAt">
) => {
  const result = await prisma.post.create({
    data,
  });
  return result;
};

const gellAllPost = async () => {
  const result = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

export const postService = {
  createPost,
  gellAllPost,
};
