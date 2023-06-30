export const authenticateDoctor = {
  post: {
    description: "Authenticate.",
    tags: ["Sessions"],
    requestBody: {
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              email: {
                type: "string",
              },
              password: {
                type: "string",
              },
            },
          },
          example: {
            email: "doctorjhondoe@example.com",
            password: "123456",
          },
        },
      },
    },
    responses: {
      "200": {
        content: {
          "application/json": {
            example: {
              doctor: {
                name: "Doctor John doe",
                email: "doctorjhondoe@example.com",
              },
              token: "example-token",
              refreshToken: "example-refresh-token",
            },
          },
        },
      },
      "400": {
        content: {
          "application/json": {
            example: {
              message: "Email or password incorrect!",
            },
          },
        },
      },
    },
  },
};

export const refreshDoctorToken = {
  post: {
    description: "Generate a new token.",
    tags: ["Sessions"],
    requestBody: {
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              refreshToken: {
                type: "string",
              },
            },
          },
          example: {
            refreshToken: "example-refresh-token",
          },
        },
      },
    },
    responses: {
      "200": {
        content: {
          "application/json": {
            example: {
              refreshToken: "example-refresh-token",
              token: "example-token",
            },
          },
        },
      },
      "400": {
        content: {
          "application/json": {
            example: {
              message: "Refresh Token does not exists!",
            },
          },
        },
      },
    },
  },
};
