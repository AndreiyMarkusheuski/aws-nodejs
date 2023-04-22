import type { AWS } from "@serverless/typescript";

import getProductsList from "@functions/getProductsList";
import getProductsById from "@functions/getProductsById";
import createProduct from "@functions/createProduct";
import catalogBatchProcess from "@functions/catalogBatchProcess";

const serverlessConfiguration: AWS = {
  service: "product-services",
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
      SNS_ARN: {
        Ref: "createProductTopic",
      },
      SQS_URL: {
        Ref: "catalogItemsQueue",
      },
      PRODUCT_TABLE_NAME: 'AWS_products',
      STOCK_TABLE_NAME: "AWS_product_stock",
    },
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: ["sns:*"],
        Resource: {
          Ref: "createProductTopic",
        },
      },
      {
        Effect: "Allow",
        Action: ["dynamodb:*"],
        Resource: "arn:aws:dynamodb:us-east-1:119690174418:table/AWS_products",
      },
      {
        Effect: "Allow",
        Action: ["dynamodb:*"],
        Resource: "arn:aws:dynamodb:us-east-1:119690174418:table/AWS_product_stock",
      },
    ],
  },
  functions: {
    getProductsList,
    getProductsById,
    createProduct,
    catalogBatchProcess,
  },
  package: { individually: true },
  resources: {
    Resources: {
      catalogItemsQueue: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: "catalog-items-sqs",
        },
      },
      createProductTopic: {
        Type: "AWS::SNS::Topic",
        Properties: {
          TopicName: "create-product-topic",
        },
      },
      createProductTopicSubscription: {
        Type: "AWS::SNS::Subscription",
        Properties: {
          Endpoint: "fs.as.8585@gmail.com",
          Protocol: "email",
          TopicArn: {
            Ref: "createProductTopic",
          },
        },
      },
      createProductTopicSubscriptionFiltered: {
        Type: "AWS::SNS::Subscription",
        Properties: {
          Endpoint: "as.fs.8585@gmail.com",
          Protocol: "email",
          TopicArn: {
            Ref: "createProductTopic",
          },
          FilterPolicy: {
            count: [{ numeric: [">", 1] }],
          },
        },
      },
    },
  },
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
