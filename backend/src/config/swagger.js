const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-Library Management API",
      version: "1.0.0",
      description: "API documentation for the E-Library Management System"
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Local server"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      },
      schemas: {
        RegisterInput: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: { type: "string", example: "Jane Doe" },
            email: { type: "string", example: "jane@example.com" },
            password: { type: "string", example: "password123" },
            role: { type: "string", enum: ["user", "admin"], example: "user" }
          }
        },
        LoginInput: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", example: "jane@example.com" },
            password: { type: "string", example: "password123" }
          }
        },
        BookInput: {
          type: "object",
          required: ["title", "author"],
          properties: {
            title: { type: "string", example: "Clean Code" },
            author: { type: "string", example: "Robert C. Martin" }
          }
        }
      }
    }
  },
  apis: ["./src/routes/*.js"]
};

module.exports = swaggerJSDoc(options);
