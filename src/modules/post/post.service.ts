import { prisma } from "@/lib/prisma";
import type { Post } from "@generated/prisma/client";
import { PostWhereInput } from "@generated/prisma/models";

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

const gellAllPost = async ({
  search,
  tags,
}: {
  search: string | undefined;
  tags: string[] | [];
}) => {
  const andConditions: PostWhereInput[] = [];
  if (search) {
    andConditions.push({
      OR: [
        {
          title: {
            contains: search!,
            mode: "insensitive",
          },
        },

        {
          content: {
            contains: search!,
            mode: "insensitive",
          },
        },
        {
          tags: {
            has: search!,
          },
        },
      ],
    });
  }

  if (tags.length > 0) {
    andConditions.push({
      tags: {
        hasEvery: tags as string[],
      },
    });
  }
  // const gellAllPost = async (payload: { search: string }) => {
  const result = await prisma.post.findMany({
    where: {
      AND: andConditions,
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
