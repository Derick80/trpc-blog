import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { postRouter } from "./routers/post";
import { s3Router } from "./routers/s3";
import { commentRouter } from "./comment";
import { categoryRouter } from './category'
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
  categories: categoryRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
