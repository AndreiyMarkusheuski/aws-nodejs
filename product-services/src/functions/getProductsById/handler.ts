import { validate } from "uuid";

import DB from "../../db";
import { RESPONSE } from "../../utils/response";
import { parseResult } from "../../utils/parse";
import { getProductWithStock } from "../../utils/get-product-stoke";
import isDefined from "../tools/is-defined";
import { productTableConfig, stockTableConfig } from "../../db/utils/consts";

const getProductsById = async (event) => {
  console.log('"getProductsById", event: ', event);

  try {
    const db = new DB();
    const { id } = event.pathParameters || {};
    if (!validate(id)) {
      return RESPONSE._400(`Product id ${id} is not valid`);
    }
    const productResult = await db.getById(productTableConfig.getById(id));
    if (productResult.Count < 1) {
      return RESPONSE._404(`Product with id ${id} not found`);
    }
    const stockResult = await db.getById(stockTableConfig.getById(id));
    if (stockResult.Count < 1) {
      return RESPONSE._500("Something went wrong. Try later");
    }

    const result = getProductWithStock(
      productResult.Items[0],
      stockResult.Items[0]
    );
    return RESPONSE._200(parseResult(result)[0]);
  } catch (e) {
    console.log(e);
    return RESPONSE._500();
  }
};

export const main = getProductsById;
