import { SwaggerOptions } from "swagger-ui-express";
import paths from "./paths";

export const swaggerConfig: SwaggerOptions = {
  openapi: "3.0.1",
  info: {
    version: "0.1.0",
    title: "PEBMED",
    description: "Documentação Api PEBMED",
  },
  servers: [
    {
      url: "http://localhost:3003",
      description: "Servidor local",
    },
  ],
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
