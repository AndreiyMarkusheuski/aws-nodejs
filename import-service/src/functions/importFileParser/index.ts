import { handlerPath } from "@libs/handler-resolver";
import { S3_BUCKET } from "src/utils/constants";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      s3: {
        bucket: S3_BUCKET,
        event: "s3:ObjectCreated:*",
        existing: true,
        rules: [
          {
            prefix: "uploaded/",
          },
        ],
      },
    },
  ],
};