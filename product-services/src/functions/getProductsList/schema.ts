export default {
  type: "object",
  properties: {
    products: {
      type: "array",
      items: [
        {
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
        {
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
        {
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
        {
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
        {
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
        {
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
      ],
    },
  },
  required: ["products"],
} as const;
