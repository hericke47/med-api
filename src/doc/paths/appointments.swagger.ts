export const createAppointment = {
  post: {
    description:
      "Create a Appointment. Obs: AppointmentStatus 1 = PENDING, AppointmentStatus 2 = CONCLUDED, AppointmentStatus 3 = CANCELED",
    tags: ["Appointments"],
    security: [
      {
        bearerAuth: [],
      },
    ],
    parameters: [
      {
        schema: {
          type: "string",
        },
        in: "path",
        name: "patientId",
        required: true,
      },
    ],
    requestBody: {
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              date: {
                type: "string",
              },
            },
          },
          example: {
            date: "2023-07-23 12:12:00",
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
              date: "2023-07-23T12:12:00.000Z",
              patient_id: "uuid",
              doctor_id: "uuid",
              appointment_status_id: 1,
              active: true,
              notes: null,
              created_at: "2023-07-03T01:35:50.440Z",
              updated_at: "2023-07-03T01:35:50.440Z",
            },
          },
        },
      },
      "400": {
        content: {
          "application/json": {
            example: [
              {
                message: "Doctor not found!",
              },
              {
                message: "Patient not found!",
              },
              {
                message: "You can't create an appointment on a past date.",
              },
              {
                message: "Already exists an appointment on this date",
              },
              {
                message:
                  "There is already an appointment in the range of this appointment",
              },
            ],
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
