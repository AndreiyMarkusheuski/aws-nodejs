import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

export const parseResult = (items) =>
  items.map((item) => {
    return unmarshall(item);
  });

export const parseToDBData = (item) => marshall(item);
