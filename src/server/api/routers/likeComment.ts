import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { z } from "zod";

export const commentLikeRouter = createTRPCRouter({
  getCommentLikes: publicProcedure
    .input(
      z.object({
        commentId: z.string().max(100),
      })
    )
    .query(async ({ ctx, input }) => {
      const { commentId } = input;
      return await ctx.prisma.commentLike.findMany({
        where: {
          commentId: commentId,
        },
        include: {
          user: true,
        },
      });
    }),
  toggleLike: protectedProcedure

    .input(
      z.object({
        commentId: z.string().max(100),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { commentId } = input;
      const userId = ctx.session.user.id;
      const like = await ctx.prisma.commentLike.findFirst({
        where: {
          commentId,
          userId,
        },
      });
      if (like) {
        await ctx.prisma.commentLike.delete({
          where: {
            commentId_userId: {
              commentId,
              userId,
            },
          },
        });
      } else {
        await ctx.prisma.commentLike.create({
          data: {
            commentId,
            userId,
          },
        });
      }
    }),
});
