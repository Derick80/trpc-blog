/* eslint-disable @typescript-eslint/no-unsafe-call */

import { type Comment, type CommentWithChildren } from "~/utils/api";
function formComments(comments: Array<Comment>) {
  const map = new Map();

  const roots: Array<CommentWithChildren> = [];

  for (const comment of comments) {
    map.set(comment.id, { ...comment, children: [] });
  }
  // This is working but so many type errors
  for (const comment of comments) {
    if (comment.parentId) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      map.get(comment.parentId).children.push(map.get(comment.id));
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      roots.push(map.get(comment.id));
    }
  }

  return roots;
}

export default formComments;
