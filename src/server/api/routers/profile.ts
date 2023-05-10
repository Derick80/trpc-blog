import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const profileRouter = createTRPCRouter({
  getProfile: publicProcedure.query(async ({ ctx }) => {
    const userId = ctx?.session?.user.id;
    if (!userId)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
      });
    return await ctx.prisma.profile.findUnique({
      where: {
        userId,
      },
    });
  }),
  createProfile: protectedProcedure
    .input(
      z.object({
        bio: z.string(),
        pronouns: z.string(),
        profileImage: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { bio, pronouns, profileImage, userId } = input;

      return await ctx.prisma.profile.create({
        data: {
          bio,
          pronouns,
          profileImage,
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });
    }),
  updateProfile: protectedProcedure
    .input(
      z.object({
        bio: z.string(),
        pronouns: z.string(),
        profileImage: z.string(),
        profileId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx?.session?.user.id;
      const { bio, pronouns, profileImage, profileId } = input;
      if (!userId)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });
      return await ctx.prisma.profile.update({
        where: {
          id: profileId,
        },
        data: {
          bio: bio,
          pronouns: pronouns,
          profileImage: profileImage,
        },
      });
    }),
});
