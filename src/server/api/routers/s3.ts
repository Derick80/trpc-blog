import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";
import { env } from "~/env.mjs";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const s3Router = createTRPCRouter({
  getStandardUploadPresignedUrl: publicProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { key } = input;
      const { s3 } = ctx;

      const putObjectCommand = new PutObjectCommand({
        Bucket: env.BUCKET_NAME,
        Key: key,
      });

      return await getSignedUrl(s3, putObjectCommand);
    }),
});
