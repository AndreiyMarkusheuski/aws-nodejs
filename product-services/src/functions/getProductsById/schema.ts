export default {
  type: "object",
  properties: {
    product: {
      type: "object",
      properties: {
        description: {
          type: "string",
        },
        id: {
          type: "string",
        },
        price: {
          type: "integer",
        },
        title: {
          type: "string",
        },
      },
      required: ["description", "id", "price", "title"],
    },
  },
} as const;
