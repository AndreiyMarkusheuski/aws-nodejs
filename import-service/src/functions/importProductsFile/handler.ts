import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { APIGatewayProxyEvent } from "aws-lambda";

import { RESPONSE } from "src/utils/response";
import { REGION, S3_BUCKET } from "src/utils/constants";
import isDefined from "src/utils/tools/is-defined";

const importProductsFile = async (event: APIGatewayProxyEvent) => {
  try {
    const { name } = event.queryStringParameters || {};
    console.log("Query String Parameters: ", event.queryStringParameters);
    console.log("File name ", name);

    if (!isDefined(name)) {
      return RESPONSE._400(`Invalid name ${name}!`);
    }
    const s3 = new S3Client({ region: REGION });

    const params = {
      Bucket: S3_BUCKET,
      Key: `uploaded/${name}`,
      ContentType: "text/csv",
    };
    const command = new PutObjectCommand(params);
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

    console.log("Url: ", signedUrl);

    return RESPONSE._200(signedUrl);
  } catch (e) {
    console.log(e);
    return RESPONSE._500();
  }
};

export const main = importProductsFile;
