// import { createTRPCRouter, publicProcedure } from '../trpc'
// import { z } from 'zod'
// import * as AWS from 'aws-sdk'
// import { Image } from '@prisma/client'




// export interface ImageMetaData extends Image {
//   url: string;
// }

// export const imageRouter = createTRPCRouter({
// getPostAttachments: publicProcedure.input(z.object({
//     postId: z.string()
// })).query(async ({ctx, input})=>{

//       const { postId } = input;
//       const images = await ctx.prisma.image.findMany({
//         where: {
//           postId,
//         },
//       });
//       const extendedFiles: ImageMetaData[] = await Promise.all(
//         images.map(async (file) => {
//           return {
//             ...file,
//             url: await s3.getSignedUrlPromise("getObject", {
//               Bucket: process.env.AWS_BUCKET_NAME,
//               Key: `${postId}/${file.id}`,
//               ResponseContentDisposition: `attachment; filename ="${file.name}"`,
//             }),
//           };
//         })
//       );

//       return extendedFiles;
//     },
//   ),

// })
