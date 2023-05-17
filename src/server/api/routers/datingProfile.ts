import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

import z from "zod";

export const datingProfileRouter = createTRPCRouter({

  getAllDatingProfiles: publicProcedure.query(async ({ ctx }) => {
    const userId = ctx?.session?.user.id;
    return await ctx.prisma.datingProfile.findMany({
      select: {
        id: true,
        bio: true,
        pronouns: true,
        user: true,
        publicPhotos:true,
        privatePhotos:{
            where:{
                unlockedById:userId,
            },
          select:{
            id:true,
            imageUrl:true,
            locked:true,
            datingProfileId:true,
        },
        

      },
      },
    });

  })
  ,
  
  getDatingProfile: publicProcedure.query(async ({ ctx }) => {
    const userId = ctx?.session?.user.id;
    if (!userId)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
      });
    return await ctx.prisma.datingProfile.findUnique({
      where: {
        userId,
      },
      include: {
        user: true,
        publicPhotos: true,
        privatePhotos: true,
      },
    });
  }),
  createDatingProfile: protectedProcedure
    .input(
      z.object({
        bio: z.string(),
        pronouns: z.string(),
        userId: z.string(),
        privatePhoto: z.string(),
        publicPhoto: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { bio, pronouns, userId, privatePhoto, publicPhoto } = input;

      return await ctx.prisma.datingProfile.create({
        data: {
          bio,
          pronouns,
          privatePhotos: {
            create: {
              imageUrl: privatePhoto,
            },
          },
          publicPhotos: {
            create: {
              imageUrl: publicPhoto,
            },
          },

          user: {
            connect: {
              id: userId,
            },
          },
        },
      });
    }),
  updateDatingProfile: protectedProcedure
    .input(
      z.object({
        bio: z.string(),
        pronouns: z.string(),
        privatePhoto: z.string().optional(),
        publicPhoto: z.string().optional(),
        profileId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx?.session?.user.id;
      const { bio, pronouns, privatePhoto, publicPhoto, profileId } = input;
      if (!userId)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });
      return await ctx.prisma.datingProfile.update({
        where: {
          id: profileId,
        },
        data: {
          bio,
          pronouns,
          privatePhotos: {
            create: {
              imageUrl: privatePhoto || "",
            },
          },
          publicPhotos: {
            create: {
              imageUrl: publicPhoto || "",

            },
          },
        },

      });
    }),
  deleteDatingProfile: protectedProcedure
    .input(
      z.object({
        profileId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx?.session?.user.id;
      const { profileId } = input;
      if (!userId)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });
      return await ctx.prisma.datingProfile.delete({
        where: {
          id: profileId,
        },
      });
    }),
  getPrivePhotoById: protectedProcedure
    .input(
      z.object({
        photoId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { photoId } = input;

      return await ctx.prisma.privatePhoto.findUnique({
        where: {
          id: photoId,
        },
      });
    }),
  getPublicPhotoById: protectedProcedure
    .input(
      z.object({
        photoId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { photoId } = input;

      return await ctx.prisma.publicPhoto.findUnique({
        where: {
          id: photoId,
        },
      });
    }),

  updatePrivatePhoto: protectedProcedure
    .input(
      z.object({
        photoId: z.string(),
        imageUrl: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { photoId, imageUrl } = input;
const userId = ctx?.session?.user.id;
      return await ctx.prisma.privatePhoto.update({
        where: {
          id: photoId,
        },
        data: {
          imageUrl,
          unlockedById: userId,
        },
      });
    }),

  updatePublicPhoto: protectedProcedure
    .input(
      z.object({
        photoId: z.string(),
        photoUrl: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { photoId, photoUrl } = input;

      return await ctx.prisma.publicPhoto.update({
        where: {
          id: photoId,
        },
        data: {
          imageUrl: photoUrl,
        },
      });
    }),
});
