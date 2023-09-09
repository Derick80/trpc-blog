import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { postRouter } from "./routers/post";
import { s3Router } from "./routers/s3";
import { commentRouter } from "./comment";
import { categoryRouter } from "./category";
import { postLikeRouter } from "./routers/likePost";
import { commentLikeRouter } from "./routers/likeComment";
import { profileRouter } from "./routers/profile";
import { userRouter } from "./routers/user";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  post: postRouter,
  s3: s3Router,
  comment: commentRouter,
  categories: categoryRouter,
  likePost: postLikeRouter,
  commentLike: commentLikeRouter,
  profile: profileRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
