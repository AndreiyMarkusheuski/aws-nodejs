import {
  CopyObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { S3Event } from "aws-lambda";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { parse } from "csv-parse";

import { RESPONSE } from "src/utils/response";
import { REGION, S3_BUCKET } from "src/utils/constants";
import isDefined from "src/utils/tools/is-defined";

const importFileParser = async (event: S3Event) => {
  console.log("importFileParser, event: ", event);

  try {
    const { Records: records } = event;
    const s3 = new S3Client({ region: REGION });
    const client = new SQSClient({ region: REGION });
    console.log("Records: ", records);

    await Promise.all(
      records.map(async (record) => {
        return new Promise(async (resolve, reject) => {
          const recordKey = record.s3.object.key;
          const parsedKey = record.s3.object.key.replace("uploaded", "parsed");

          const commandGet = new GetObjectCommand({
            Bucket: S3_BUCKET,
            Key: recordKey,
          });
          const response = await s3.send(commandGet);
          const stream = await response.Body;
          console.log("Stream", stream);

          stream
            .pipe(parse())
            .on("data", async (data) => {
              const sqsUrl = process.env.SQS_URL;
              console.log('SQS Url: ', sqsUrl, ', data: ', data);

              try {
                const command = new SendMessageCommand({
                  MessageBody: JSON.stringify(data),
                  QueueUrl: sqsUrl,
                })
                const response = await client.send(command);

                console.info('Successfully. SQS Url', sqsUrl);
              } catch (err) {
                console.error('Error. SQS Url', sqsUrl);
                console.error('Error. Error', err);
              }
            })
            .on("error", (e) => {
              console.error("Error", e);
              reject();
            })
            .on("end", async () => {
              try {
                const commandCopy = new CopyObjectCommand({
                  CopySource: `${S3_BUCKET}/${recordKey}`,
                  Bucket: S3_BUCKET,
                  Key: parsedKey,
                });

                await s3.send(commandCopy);

                console.log(`${recordKey} copied to ${parsedKey}`);

                const commandDelete = new DeleteObjectCommand({
                  Bucket: S3_BUCKET,
                  Key: recordKey,
                });

                await s3.send(commandDelete);

                console.log(`Deleted ${recordKey}`);
                resolve();
              } catch (e) {
                console.log(e);
              }
            });
        });
      })
    );
  } catch (e) {
    console.log(e);
    return RESPONSE._500();
  }
};

export const main = importFileParser;
