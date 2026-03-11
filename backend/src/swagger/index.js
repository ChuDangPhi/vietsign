const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("./docs");

const specs = {
  openapi: "3.0.0",
  info: {
    title: "Vietsignschool API",
    version: "1.0.0",
    description: "API Documentation for Vietsignschool",
  },
  servers: [
    {
      url: "https://vietsign.ibme.edu.vn/user-service",
      description: "Production Server",
    },
    {
      url: "http://localhost:8080",
      description: "Development Server",
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
  paths: swaggerDocs,
};

module.exports = { specs, swaggerUi };
