export const createPatient = {
  post: {
    description:
      "Create a patient. Obs: GenderId 1 = Feminine, GenderId 2 = Masculine",
    tags: ["Patients"],
    security: [
      {
        bearerAuth: [],
      },
    ],
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
            birthDate: "09/01/2003",
            email: "patient-example@gmail.com",
            genderId: 1,
            height: 170,
            name: "Patient Example",
            phone: "48999999999",
            weight: 68.8,
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
              name: "Patient Example",
              phone: "48999999999",
              email: "patient-example@gmail.com",
              height: 170,
              weight: 68.8,
              birth_date: "2003-09-01T00:00:00.000Z",
              gender_id: 1,
              doctor_id: "uuid",
            },
          },
        },
      },
      "400": {
        content: {
          "application/json": {
            example: {
              message: "Doctor not found!",
            },
          },
        },
      },
      "401": {
        content: {
          "application/json": {
            example: [
              {
                error: true,
                code: "token.expired",
                message: "Token invalid.",
              },
              {
                error: true,
                code: "token.invalid",
                message: "Token not present.",
              },
            ],
          },
        },
      },
    },
  },
};
