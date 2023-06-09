import type { AWS } from "@serverless/typescript";

import importFileParser from "@functions/importFileParser";
import importProductsFile from "@functions/importProductsFile";

const serverlessConfiguration: AWS = {
  service: "import-service",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild"],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    region: "us-east-1",
    profile: "xiolow",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      S3_BUCKET: "nodejs-aws-import-product-service",
      SQS_URL: 'https://sqs.us-east-1.amazonaws.com/119690174418/catalog-items-sqs',
    },
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: ["s3:*"],
        Resource: "arn:aws:s3:::${self:provider.environment.S3_BUCKET}/*",
      },
      {
        Effect: "Allow",
        Action: ["sqs:*"],
        Resource: "arn:aws:sqs:us-east-1:119690174418:catalog-items-sqs",
      },
    ],
  },
  functions: { importFileParser, importProductsFile },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;