import DB from "../../db";
import { RESPONSE } from "../../utils/response";
import { parseResult } from "../../utils/parse";
import isDefined from "../tools/is-defined";
import { productTableConfig } from "../../db/utils/consts";

const getProductsList = async (event) => {
  console.log('"getProductsList", event: ', event);

  try {
    const db = new DB();
    const result = await db.getAll(productTableConfig.getAll);
    return RESPONSE._200(parseResult(result.Items));
  } catch (e) {
    console.log(e);
    return RESPONSE._500();
  }
};

export const main = getProductsList;
