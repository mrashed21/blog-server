const createComment = async (payload: {
  content: string;
  authorId: string;
  postId: string;
  parentId: string;
}) => {};

export const commentService = {
  createComment,
};
