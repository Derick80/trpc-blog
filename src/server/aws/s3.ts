import { S3 } from "@aws-sdk/client-s3";
import {env} from "~/env.mjs";

const bucket =env.BUCKET_NAME;
if(!bucket) throw new Error("AWS_BUCKET_NAME is not defined");

const accessKeyId = env.ACCESS_KEY_ID;
if(!accessKeyId) throw new Error("ACCESS_KEY_ID is not defined");

const secretAccessKey = env.SECRET_ACCESS_KEY;
if(!secretAccessKey) throw new Error("SECRET_ACCESS_KEY is not defined");

export const s3 = new S3({
  region: env.BUCKET_REGION,
  credentials: {
    accessKeyId,
    secretAccessKey,

  },
});
