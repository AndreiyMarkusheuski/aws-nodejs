import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";

import schema from "./schema";
import mockData from "./mock.json";

const getProductsList: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async (event) => {
  const { data, headers } = mockData;
  return {
    headers: headers,
    statusCode: 200,
    body: JSON.stringify(data),
  };
};

export const main = middyfy(getProductsList);
