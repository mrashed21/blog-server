import { prisma } from "@/lib/prisma";
import type { Post, PostStatus } from "@generated/prisma/client";
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
  isFeatured,
  status,
}: {
  search: string | undefined;
  tags: string[] | [];
  isFeatured: boolean | undefined;
  status: PostStatus | undefined;
}) => {
  const andConditions: PostWhereInput[] = [];
  // search string
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
  // tags array []
  if (tags.length > 0) {
    andConditions.push({
      tags: {
        hasEvery: tags as string[],
      },
    });
  }

  // isFeatured
  if (typeof isFeatured == "boolean") {
    andConditions.push({
      isFeatured,
    });
  }
  // status
  if (status) {
    andConditions.push({
      status,
    });
  }

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
