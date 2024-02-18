import { SwaggerOptions } from "swagger-ui-express";
import paths from "./paths";

export const swaggerConfig: SwaggerOptions = {
  openapi: "3.0.1",
  info: {
    version: "0.1.0",
    title: "med",
    description:
      "Documentação Api med, com o objetivo de possibilitar o acompanhamento de agendamentos de consultas de um médico. <br><br> Feita com os padrões REST.",
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  paths,
};
