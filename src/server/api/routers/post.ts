
import {
    createTRPCRouter,
    publicProcedure,
    protectedProcedure,
  } from "~/server/api/trpc";
  import { z } from "zod";
import crypto from "crypto";

  const getSlug = (title: string) =>
    title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

  export const postRouter = createTRPCRouter({
    getAll: publicProcedure.query(({
        ctx
    })=>{
        return ctx.prisma.post.findMany({
            orderBy:{
                createdAt: 'desc'
            },
            select:{
                id: true,
                title: true,
                slug: true,
                content: true,
                createdAt: true,
                updatedAt: true,
                comments: true,


            }
        })
    }),

    new: protectedProcedure.input(z.object({
        title: z.string().max(100),
        content: z.string().min(10)

})
).mutation(async ({
    ctx,
    input
})=>{
    const slug = getSlug(input.title)


    return await ctx.prisma.post.create({
        data:{
            title: input.title,
            content: input.content,
            slug: slug,
           author:{
               connect:{
                   id: ctx.session.user.id
               }
           }
        }
    })

}
),
updatePost: protectedProcedure.input(z.object({
    postId: z.string().cuid(),
    slug: z.string().max(100),
    title: z.string().max(100),
    content: z.string().min(10)
})
).mutation(async ({
    ctx,
    input
})=>{
    return await ctx.prisma.post.update({
        where:{
            id: input.postId
        },
        data:{
            title: input.title,
            content: input.content,
        }
    })
}
),
deletePost: protectedProcedure.input(z.object({
    postId: z.string().cuid(),
})
).mutation(async ({
    ctx,
    input
})=>{
    return await ctx.prisma.post.delete({
        where:{
            id: input.postId
        }
    })

}
),


    getSingle: publicProcedure.input(z.object({
        slug: z.string()
    })).query(({
        ctx,
        input
    })=>{
        return ctx.prisma.post.findUnique({
            where:{
              slug: input.slug
            }
        })
    }
    )
    });
