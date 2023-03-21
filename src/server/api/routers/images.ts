import { createTRPCRouter, protectedProcedure } from '../trpc'


export const imagesRouter = createTRPCRouter({
addImage: protectedProcedure
})