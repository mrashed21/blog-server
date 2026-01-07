import { prisma } from "@/lib/prisma";
import {
  CommnetStatus,
  type Post,
  type PostStatus,
} from "@generated/prisma/client";
import { PostWhereInput } from "@generated/prisma/models";

// cretate post
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

// get all post
const gellAllPost = async ({
  search,
  tags,
  isFeatured,
  status,
  authorId,
  page,
  limit,
  skip,
  sortBy,
  sortOrder,
}: {
  search: string | undefined;
  tags: string[] | [];
  isFeatured: boolean | undefined;
  status: PostStatus | undefined;
  authorId: string | undefined;
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
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
  // authorId
  if (authorId) {
    andConditions.push({
      authorId,
    });
  }
  const result = await prisma.post.findMany({
    take: limit,
    skip,
    where: {
      AND: andConditions,
    },

    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      _count: {
        select: { comments: true },
      },
    },
  });

  // totaData
  const totaData = await prisma.post.count({
    where: {
      AND: andConditions,
    },
  });

  return {
    data: result,
    pagination: {
      totaData,
      page,
      limit,
      totalPage: Math.ceil(totaData / limit),
    },
  };
};

// get post by id
const getPostById = async (postId: string) => {
  return await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: {
        id: postId,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });
    const result = await tx.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        comments: {
          where: {
            parentId: null,
            status: CommnetStatus.approved,
          },
          orderBy: { createdAt: "desc" },
          include: {
            replays: {
              where: { status: CommnetStatus.approved },
              orderBy: { createdAt: "asc" },
              include: {
                replays: {
                  where: {
                    status: CommnetStatus.approved,
                  },
                  orderBy: { createdAt: "asc" },
                },
              },
            },
          },
        },
        _count: {
          select: { comments: true },
        },
      },
    });

    return result;
  });
};

// get my posts
const getMyPosts = async (authorId: string) => {
  // check user status
  await prisma.user.findUniqueOrThrow({
    where: {
      id: authorId,
      status: "active",
    },
    select: {
      id: true,
    },
  });
  const result = await prisma.post.findMany({
    where: {
      authorId,
    },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });
  const totaData = await prisma.post.count({
    where: {
      authorId,
    },
  });
  return { result, totaData };
};
export const postService = {
  createPost,
  gellAllPost,
  getPostById,
  getMyPosts,
};
