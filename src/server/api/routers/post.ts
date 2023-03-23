import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { z } from "zod";

const getSlug = (title: string) =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const postRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        slug: true,
        imageUrl: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        comments:true,
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
          },
        },
      },
    });
  }),

  new: protectedProcedure
    .input(
      z.object({
        title: z.string().max(100),
        content: z.string().min(10),
        url: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const slug = getSlug(input.title);
      const { title, content, url } = input;

      return await ctx.prisma.post.create({
        data: {
          title: title,
          content: content,
          slug: slug,
          imageUrl: url,
          author: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
    }),
  updatePost: protectedProcedure
    .input(
      z.object({
        postId: z.string().cuid(),
        title: z.string().max(100),
        content: z.string().min(10),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.post.update({
        where: {
          id: input.postId,
        },
        data: {
          title: input.title,
          content: input.content,
        },
      });
    }),
  deletePost: protectedProcedure
    .input(
      z.object({
        postId: z.string().cuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.post.delete({
        where: {
          id: input.postId,
        },
      });
    }),

  getSingle: publicProcedure
    .input(
      z.object({
        postId: z.string().cuid(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.post.findUnique({
        where: {
          id: input.postId,
        },
        include:{
          comments:true,
        },

      });
    }),
});
