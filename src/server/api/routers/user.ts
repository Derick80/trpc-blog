import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getUsers: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findMany();
  }),
  getUser: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.user.findUnique({
        where: {
          id: input.id,
        },
      });
    }),
  getUserProfile: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.user.findUnique({
        where: {
          id: input.id,
        },
        include: {
          profile: true,
          _count: {
            select: {
              posts: true,
              comments: true,
              likes: true,
              commentLikes: true,
            },
          },
        },
      });
    }),
  getAllUsers: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findMany({
      include: {
        profile: true,
        _count: {
          select: {
            posts: true,
            comments: true,
            likes: true,
            commentLikes: true,
          },
        },
      },
    });
  }),
});
