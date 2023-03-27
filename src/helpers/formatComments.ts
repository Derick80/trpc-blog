/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Comment, CommentWithChildren } from "~/utils/api";
function formComments(comments: Array<Comment>) {
  const map = new Map();

  const roots: Array<CommentWithChildren> = [];

  for (const comment of comments) {
    map.set(comment.id, { ...comment, children: [] });
  }
  // This is working but so many type errors
  for (const comment of comments) {
    if (comment.parentId) {
      map.get(comment.parentId).children.push(map.get(comment.id));
    } else {
      roots.push(map.get(comment.id));
    }
  }

  return roots;
}

export default formComments;
