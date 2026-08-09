const express = require("express"); // Express framework.
const cors = require("cors"); // Enables cross-origin requests.
const helmet = require("helmet"); // Adds security headers.
const morgan = require("morgan"); // Logs HTTP requests.
const path = require("path"); // Handles file paths.
const swaggerUi = require("swagger-ui-express"); // Swagger UI.

const cakeRoutes = require("./routes/cakeRoutes"); // Catalog API routes.
const swaggerSpec = require("./docs/swagger"); // Swagger configuration.
const notFoundHandler = require("./middleware/notFoundMiddleware"); // Handles unknown routes.
const errorHandler = require("./middleware/errorMiddleware"); // Handles application errors.

const app = express();

app.use(express.static(path.join(__dirname, "../public"))); // Serves the frontend.

app.use(cors()); // Enables CORS.
app.use(helmet()); // Adds security headers.
app.use(express.json()); // Parses JSON request bodies.
app.use(morgan("dev")); // Logs incoming requests.

app.get("/health", (req, res) => { // Checks Catalog Service health.
    res.status(200).json({
        success: true,
        service: "Catalog Service",
        status: "Running"
    });
});

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
); // Serves Swagger API documentation.

app.use(
    "/api/catalog/cakes",
    cakeRoutes
); // Registers Catalog API routes.

app.use(notFoundHandler); // Handles requests to unknown routes.

app.use(errorHandler); // Handles application errors.

module.exports = app; // Exports the Express application.