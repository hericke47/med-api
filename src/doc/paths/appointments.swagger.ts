export const createAppointment = {
  post: {
    description: "Cria um agendamento",
    summary: "Criação de agendamento",
    tags: ["Agendamentos"],
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
              date: {
                type: "string",
              },
              patientId: {
                type: "string",
              },
            },
          },
          example: {
            date: "2023-07-23 12:12:00",
            patientId: "patient-uuid",
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

export const updateAndDeleteAppointment = {
  put: {
    description:
      "Atualiza um agendamento. Obs: AppointmentStatus 1 = PENDING, AppointmentStatus 2 = CONCLUDED, AppointmentStatus 3 = CANCELED",
    summary: "Atualização de um agendamento",
    tags: ["Agendamentos"],
    parameters: [
      {
        schema: {
          type: "string",
        },
        in: "path",
        name: "appointmentId",
        required: true,
      },
    ],
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
              date: {
                type: "string",
              },
              patientId: {
                type: "string",
              },
              appointmentStatusId: {
                type: "nubmer",
              },
            },
          },
          example: {
            date: "2025-07-22 09:33:00",
            patientId: "patient-uuid",
            appointmentStatusId: 1,
          },
        },
      },
    },
    responses: {
      "200": {
        content: {
          "application/json": {
            example: {
              id: "uuid",
              date: "2025-07-22T09:33:00.000Z",
              notes: null,
              patient_id: "patient-uuid",
              doctor_id: "doctor-uuid",
              appointment_status_id: 1,
              created_at: "2023-07-03T23:03:20.308Z",
              updated_at: "2023-07-03T23:03:40.470Z",
            },
          },
        },
      },
      "400": {
        content: {
          "application/json": {
            example: [
              {
                message: "Appointment Status not found!",
              },
              {
                message: "Doctor not found!",
              },
              {
                message: "Patient not found!",
              },
              {
                message: "Appointment not found!",
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
  delete: {
    description: "Marca o agendamento como 'Canceled'",
    summary: "Deleção de um agendamento",
    tags: ["Agendamentos"],
    parameters: [
      {
        schema: {
          type: "string",
        },
        in: "path",
        name: "appointmentId",
        required: true,
      },
    ],
    security: [
      {
        bearerAuth: [],
      },
    ],
    responses: {
      "200": {
        content: {},
      },
      "400": {
        content: {
          "application/json": {
            example: [
              {
                message: "Doctor not found!",
              },
              {
                message: "Appointment not found!",
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
  patch: {
    description: "Atualiza anotações do agendamento",
    summary: "Atualização de anotações do agendamento",
    tags: ["Agendamentos"],
    parameters: [
      {
        schema: {
          type: "string",
        },
        in: "path",
        name: "appointmentId",
        required: true,
      },
    ],
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
              notes: {
                type: "string",
              },
            },
          },
          example: {
            notes: "Example note",
          },
        },
      },
    },
    responses: {
      "200": {
        content: {
          "application/json": {
            example: {
              id: "uuid",
              date: "2025-07-22T09:33:00.000Z",
              notes: null,
              patient_id: "patient-uuid",
              doctor_id: "doctor-uuid",
              appointment_status_id: 1,
              created_at: "2023-07-03T23:03:20.308Z",
              updated_at: "2023-07-03T23:03:40.470Z",
            },
          },
        },
      },
      "400": {
        content: {
          "application/json": {
            example: [
              {
                message: "Appointment not found!",
              },
              {
                message: "Doctor not found!",
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

export const listAppointments = {
  get: {
    description: "Lista os agendamentos de um paciente",
    summary: "Listagem de agendamentos",
    tags: ["Agendamentos"],
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
    security: [
      {
        bearerAuth: [],
      },
    ],
    responses: {
      "200": {
        content: {
          "application/json": {
            example: [
              {
                id: "uuid",
                date: "2023-07-22T09:33:00.000Z",
                notes: null,
                appointmentStatus: {
                  id: 1,
                  name: "Pending",
                  created_at: "2023-07-04T02:04:44.512Z",
                  updated_at: "2023-07-04T02:04:44.512Z",
                },
              },
            ],
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
