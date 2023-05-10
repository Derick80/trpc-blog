import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { z } from "zod";

export const postLikeRouter = createTRPCRouter({
  getPostLikes: publicProcedure
    .input(
      z.object({
        postId: z.string().max(100),
      })
    )
    .query(async ({ ctx, input }) => {
      const { postId } = input;
      return await ctx.prisma.like.findMany({
        where: {
          postId: postId,
        },
        include: {
          user: true,
        },
      });
    }),
  toggleLike: protectedProcedure
    .input(
      z.object({
        postId: z.string().max(100),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { postId } = input;
      const userId = ctx.session.user.id;
      const like = await ctx.prisma.like.findFirst({
        where: {
          postId,
          userId,
        },
      });
      if (like) {
        await ctx.prisma.like.delete({
          where: {
            postId_userId: {
              postId,
              userId,
            },
          },
        });
      } else {
        await ctx.prisma.like.create({
          data: {
            postId,
            userId,
          },
        });
      }
    }),
});
