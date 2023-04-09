export const productTableConfig = {
  getAll: {
    TableName: process.env.PRODUCT_TABLE_NAME || "AWS_products",
  },
  getById: (id) => {
    return {
      TableName: process.env.PRODUCT_TABLE_NAME || "AWS_products",
      ExpressionAttributeValues: {
        ":v1": { S: id },
      },
      KeyConditionExpression: "id = :v1",
    };
  },
  create: (data) => {
    return {
      TableName: process.env.PRODUCT_TABLE_NAME || "AWS_products",
      Item: data,
    };
  },
};

export const stockTableConfig = {
  getById: (id) => {
    return {
      TableName: process.env.STOCK_TABLE_NAME || "AWS_product_stock",
      ExpressionAttributeValues: {
        ":v1": { S: id },
      },
      KeyConditionExpression: "product_id = :v1",
    };
  },
  create: (data) => {
    return {
      TableName: process.env.PRODUCT_TABLE_NAME || "AWS_product_stock",
      Item: data,
    };
  },
};
