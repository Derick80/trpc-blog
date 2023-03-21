import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";


export const commentRouter = createTRPCRouter({
    getAll: publicProcedure.input(z.object({
        slug: z.string().max(100)
    })).query(

        ({
        ctx,
        input
    })=>{
        const {slug} = input
        try{
        const comments= ctx.prisma.comment.findMany({
            where:{
                Post:{
                    slug
                }
            },
            orderBy:{
                createdAt: 'desc'
            },
            select:{
                id: true,
                body: true,
                createdAt: true,
                parentId: true,
                postId: true,
                user:true
            }
})
        return comments
    }catch(err){
        throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
        })


    }
    }
    ),
    create: protectedProcedure.input(z.object({
        body: z.string().min(10),
        slug: z.string().max(100),
        parentId: z.string().optional()
    })).mutation(async ({
        ctx,
        input
    })=>{
        const {body, slug,parentId} = input
        try{
        const comment = await ctx.prisma.comment.create({
            data:{
                body,
                Post:{
                    connect:{
                        slug
                    }
                },
                user:{
                    connect:{
                        id: ctx.session.user.id
                    }
                },
                ...(parentId) && {
                    parent:{
                        connect:{
                            id: parentId

                        }
                    }
                }
            }
        })

        return comment
    }catch(err){
        throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
        })
    }



    })
})
