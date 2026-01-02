import { prisma } from "@/lib/prisma";
import type { Post } from "@generated/prisma/client";

const createPost = async (
  data: Omit<Post, "id" | "createdAt" | "updatedAt" | "authorId">,
  UserId: string
) => {
  const result = await prisma.post.create({
    data: {
      ...data,
      authorId: UserId,
    },
  });
  return result;
};

const gellAllPost = async (payload: {
  search: string | undefined;
  tags: string[] | [];
}) => {
  // const gellAllPost = async (payload: { search: string }) => {
  const result = await prisma.post.findMany({
    where: {
      OR: [
        {
          title: {
            contains: payload.search!,
            mode: "insensitive",
          },
        },

        {
          content: {
            contains: payload.search!,
            mode: "insensitive",
          },
        },
        {
          tags: {
            has: payload.search!,
          },
        },
      ],
    },
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
