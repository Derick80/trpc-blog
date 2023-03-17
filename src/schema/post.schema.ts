import z from "zod";


export const createPostSchema = z.object({
    title: z.string().max(100),
    content: z.string().min(10),
    userId: z.string().uuid()
})

export type CreatePostInput = z.TypeOf<typeof createPostSchema>

export const getSinglePostSchema = z.object({
  postId: z.string().uuid(),
})