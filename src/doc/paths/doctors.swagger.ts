export const createDoctor = {
  post: {
    description: "Create a doctor.",
    tags: ["Doctors"],
    requestBody: {
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              name: {
                type: "string",
              },
              email: {
                type: "string",
              },
              password: {
                type: "string",
              },
            },
          },
          example: {
            name: "Doctor John doe",
            email: "doctorjhondoe@example.com",
            password: "123456",
          },
        },
      },
    },
    responses: {
      "201": {
        content: {
          "application/json": {
            example: {
              id: "uuid",
              name: "Doctor John doe",
              email: "doctorjhondoe@example.com",
              password: "hashed-password",
            },
          },
        },
      },
      "400": {
        content: {
          "application/json": {
            example: {
              message: "Email address already used.",
            },
          },
        },
      },
    },
  },
};
