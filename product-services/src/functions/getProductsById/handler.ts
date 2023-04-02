import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";

import isDefined from "../tools/is-defined";

import schema from "./schema";
import mockData from "./mock.json";

const getProductsById: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async (event) => {
  const { headers, products } = mockData;
  const { id } = event.pathParameters;
  const [product] = products.filter((item) => item.id === id);

  const response = {
    headers: headers,
    statusCode: 404,
    body: JSON.stringify(`Not found product with id: ${id}`),
  };

  if (isDefined(product)) {
    response.statusCode = 200;
    response.body = JSON.stringify(product);
  }

  return response;
};

export const main = middyfy(getProductsById);
