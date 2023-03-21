import {Comment, CommentWithChildren } from '~/server/api/trpc'

function formComments(comments: Array<Comment>) {
  const map = new Map();

  const roots: Array<CommentWithChildren> = [];

  for (let i = 0; i < comments.length; i++) {
    const commentId = comments[i]?.id;

    map.set(commentId, i);

    (comments[i] as CommentWithChildren).children = [];
// changd below to add as
    if (typeof comments[i]?.parentId === "string") {
      const parentCommentIndex: number = map.get(comments[i]?.parentId) as number;

      (comments[parentCommentIndex] as CommentWithChildren).children.push(
        comments[i] as CommentWithChildren
      );

      continue;
    }

    roots.push(comments[i] as CommentWithChildren);
  }

  return roots;
}

export default formComments;
