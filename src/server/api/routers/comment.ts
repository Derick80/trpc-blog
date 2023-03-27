import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const commentRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        postId: z.string().max(100),
      })
    )
    .query(async ({ ctx, input }) => {
      const { postId } = input;
      try {
        const comments = await ctx.prisma.comment.findMany({
          where: {
            Post: {
              id: postId,
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          include: {
            user: true,
          },
        });
        return comments;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
  create: protectedProcedure
    .input(
      z.object({
        body: z.string().min(10),
        postId: z.string().max(100),
        parentId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { body, postId, parentId } = input;
      try {
        const comment = await ctx.prisma.comment.create({
          data: {
            body,
            Post: {
              connect: {
                id: postId,
              },
            },
            user: {
              connect: {
                id: ctx.session.user.id,
              },
            },
            ...(parentId && {
              parent: {
                connect: {
                  id: parentId,
                },
              },
            }),
          },
        });

        return comment;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
});
