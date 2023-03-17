
import {
    createTRPCRouter,
    publicProcedure,
    protectedProcedure,
  } from "~/server/api/trpc";
  import { z } from "zod";

  export const postRouter = createTRPCRouter({
    getAll: publicProcedure.query(({
        ctx
    })=>{
        return ctx.prisma.post.findMany({
            orderBy:{
                createdAt: 'desc'
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
    return await ctx.prisma.post.create({
        data:{
            title: input.title,
            content: input.content,
           author:{
               connect:{
                   id: ctx.session.user.id
               }
           }
        }
    })

}
),

    getSingle: publicProcedure.input(z.object({
        postId: z.string().uuid(),
    })).query(({
        ctx,
        input
    })=>{
        return ctx.prisma.post.findUnique({
            where:{
                id: input.postId
            }
        })
    }
    )
    });
