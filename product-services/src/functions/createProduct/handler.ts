import { validate, v4 as uuidv4 } from "uuid";

import DB from "../../db";
import { RESPONSE } from "../../utils/response";
import { parseToDBData, parseResult } from "../../utils/parse";
import { getProductWithStock } from "../../utils/get-product-stoke";
import isDefined from "../tools/is-defined";

import { productTableConfig, stockTableConfig } from "../../db/utils/consts";

const createProduct = async (event) => {
  console.log('"createProduct", event: ', event);

  try {
    const db = new DB();
    const data = JSON.parse(event.body);
    const { title, description = "", price = 0, count } = data;

    if (isDefined(data) || isDefined(title) || !price || !count) {
      RESPONSE._404("Invalid product data");
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
      return RESPONSE._500();
    }

    const preparedStockData = parseToDBData({ product_id: id, count });
    const stockResult = await db.create(
      stockTableConfig.create(preparedStockData)
    );
    if (stockResult["$metadata"].httpStatusCode !== 200) {
      return RESPONSE._500();
    }

    const result = getProductWithStock(preparedProductData, preparedStockData);
    return RESPONSE._200(parseResult(result)[0]);
  } catch (e) {
    console.log(e);
    return RESPONSE._500();
  }
};

export const main = createProduct;
