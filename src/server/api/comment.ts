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
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().max(100),
        body: z.string().min(10),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, body } = input;
      try {
        const comment = await ctx.prisma.comment.update({
          where: {
            id,
          },
          data: {
            body,
          },
        });
        return comment;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string().max(100),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      try {
        const comment = await ctx.prisma.comment.delete({
          where: {
            id,
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
