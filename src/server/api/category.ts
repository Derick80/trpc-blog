import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const categoryRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.category.findMany({
      orderBy: {
        value: "asc",
      },
      select: {
        id: true,
        value: true,
      },
    });
  }),
  getSingle: publicProcedure
    .input(
      z.object({
        categoryId: z.string().max(100),
      })
    )
    .query(async ({ ctx, input }) => {
      const { categoryId } = input;
      const category = await ctx.prisma.category.findUnique({
        where: {
          id: categoryId,
        },
      });
      return category;
    }),
  create: publicProcedure
    .input(
      z.object({
        value: z.string().max(100),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { value } = input;
      const category = await ctx.prisma.category.create({
        data: {
          value,
        },
      });
      return category;
    }),
  update: publicProcedure
    .input(
      z.object({
        categoryId: z.string().max(100),
        value: z.string().max(100),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { categoryId, value } = input;
      const category = await ctx.prisma.category.update({
        where: {
          id: categoryId,
        },
        data: {
          value,
        },
      });
      return category;
    }),
  delete: publicProcedure
    .input(
      z.object({
        categoryId: z.string().max(100),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { categoryId } = input;
      const category = await ctx.prisma.category.delete({
        where: {
          id: categoryId,
        },
      });
      return category;
    }),
});
