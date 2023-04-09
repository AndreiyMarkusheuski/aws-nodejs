export const getProductWithStock = (productItem, stockItem) => [
  { ...productItem, count: stockItem.count },
];
