import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { validate, v4 as uuidv4 } from "uuid";

import { RESPONSE } from "src/utils/response";
import { REGION } from "src/utils/constants";
import isDefined from "src/utils/tools/is-defined";
import DB from "../../db";
import { parseToDBData, parseResult } from "src/utils/parse";
import { getProductWithStock } from "src/utils/get-product-stoke";
import { productTableConfig, stockTableConfig } from "../../db/utils/consts";

const sendNotification = async (data = {}) => {
  try {
    const message = JSON.stringify(data);
    console.log('"sendNotification", message: ', message);
    const client = new SNSClient({ region: REGION });

    const command = new PublishCommand({
      TopicArn: process.env.SNS_ARN,
      Subject: "Created product",
      Message: message,
    });
    const response = await client.send(command);

    console.log(
      "Successfully. SNS url: ",
      process.env.SNS_ARN,
      ", message: ",
      message
    );
  } catch (e) {
    console.log("Error with SNS, error: ", e);
  }
};

const sendToDB = async (data) => {
  try {
    const db = new DB();
    const [title, description = "", price = 0, count] = data;

    if (isDefined(data) || isDefined(title) || !price || !count) {
      throw new Error("Invalid product data");
    }
    const id = uuidv4();

    const preparedProductData = parseToDBData({
      id,
      title,
      description,
      price,
    });
    const productResult = await db.create(
      productTableConfig.create(preparedProductData)
    );
    if (productResult["$metadata"].httpStatusCode !== 200) {
      throw new Error("Failed request - product");
    }

    const preparedStockData = parseToDBData({ product_id: id, count });
    const stockResult = await db.create(
      stockTableConfig.create(preparedStockData)
    );
    if (stockResult["$metadata"].httpStatusCode !== 200) {
      throw new Error("Failed request - stock");
    }

    const result = getProductWithStock(preparedProductData, preparedStockData);
    return result;
  } catch (e) {
    console.log(e);
    throw new Error("Error:", e);
  }
};

const catalogBatchProcess = async (event) => {
  console.log('"catalogBatchProcess": ', event);

  try {
    const { Records: records } = event;
    console.log("Records: ", records);

    return await Promise.all(
      records.map(async (record) => {
        const productData = JSON.parse(record.body);
        console.log("Product data", productData);

        await sendToDB(productData);
        console.log("Product created");

        await sendNotification(productData);

        return productData;
      })
    );
  } catch (e) {
    console.log(e);
    return RESPONSE._500();
  }
};

export const main = catalogBatchProcess;
