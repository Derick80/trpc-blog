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
// comment here
export const postRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.post.findMany({
      where: {
        published: true,
      },
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
        published: true,
        authorId: true,
        categories: true,
        comments: {
          select: {
            id: true,
            body: true,
            createdAt: true,
            updatedAt: true,
            userId: true,
            postId: true,
            parentId: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
        likes: true,
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
            emailVerified: true,
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
        category: z.string().max(100),
        url: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const slug = getSlug(input.title);
      const { title, content, url, category } = input;
      const categories = category.split(",").map((category) => category.trim());
      console.log(categories, "categories");

      return await ctx.prisma.post.create({
        data: {
          title: title,
          content: content,
          slug: slug,
          imageUrl: url,
          categories: {
            connectOrCreate: categories.map((category) => ({
              where: { value: category },
              create: { value: category },
            })),
          },
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
        categories: z.string().max(100).array(),
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
          categories: {
            set: input.categories.map((category) => ({
              value: category,
            })),
          },
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
        select: {
          id: true,
          title: true,
          slug: true,
          imageUrl: true,
          content: true,
          createdAt: true,
          updatedAt: true,
          published: true,
          authorId: true,
          categories: true,
          comments: {
            select: {
              id: true,
              body: true,
              createdAt: true,
              updatedAt: true,
              userId: true,
              postId: true,
              parentId: true,
            },
          },
          _count: {
            select: {
              comments: true,
              likes: true,
            },
          },
          likes: true,
          author: {
            select: {
              id: true,
              name: true,
              image: true,
              email: true,
              emailVerified: true,
            },
          },
        },
      });
    }),
  likePost: protectedProcedure
    .input(
      z.object({
        postId: z.string().cuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const likedPost = await ctx.prisma.like.findUnique({
        where: {
          postId_userId: {
            postId: input.postId,
            userId: ctx.session.user.id,
          },
        },
      });

      if (likedPost === null) {
        await ctx.prisma.like.create({
          data: {
            user: {
              connect: {
                id: ctx.session.user.id,
              },
            },
            post: {
              connect: {
                id: input.postId,
              },
            },
          },
        });
        const updatedPost = await ctx.prisma.post.findUniqueOrThrow({
          where: {
            id: input.postId,
          },
          include: {
            _count: {
              select: {
                likes: true,
              },
            },
          },
        });

        const { _count, ...postData } = updatedPost;
        return {
          updatedPost: {
            ...postData,
            likesCount: _count.likes,
            likedByUser: likedPost === null,
          },
        };
      }
    }),
  getPostByCategory: publicProcedure
    .input(
      z.object({
        category: z.string().max(100),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.post.findMany({
        where: {
          categories: {
            some: {
              id: input.category,
            },
          },
        },
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
          published: true,
          authorId: true,
          categories: {
            select: {
              id: true,
              value: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          comments: {
            select: {
              id: true,
              body: true,
              createdAt: true,
              updatedAt: true,
              userId: true,
              postId: true,
              parentId: true,
            },
          },
          author: {
            select: {
              id: true,
              name: true,
              image: true,
              email: true,
              emailVerified: true,
            },
          },

          _count: {
            select: {
              comments: true,
              likes: true,
            },
          },
          likes: true,
        },
      });
    }),
});
