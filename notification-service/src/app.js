const express = require("express");
const cors = require("cors");

const notificationRoutes = require("./routes/notificationRoutes");

const notFoundMiddleware = require("./middleware/notFoundMiddleware");
const errorMiddleware = require("./middleware/errorMiddleware");
const path = require("path");
const setupSwagger = require("./docs/swagger");

const app = express();

app.use(express.static(
    path.join(__dirname, "../public")
));
// CORS
app.use(cors());


// Body parsers
app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));


// Health check
app.get("/health", (req, res) => {
    return res.status(200).json({
        success: true,
        service: "Notification Service",
        status: "Running"
    });
});

app.get("/", (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Notification Service is running"
    });
});


// Notification routes
app.use(
    "/api/notifications",
    notificationRoutes
);


// Swagger documentation
setupSwagger(app);


// 404 handler
app.use(notFoundMiddleware);


// Global error handler
app.use(errorMiddleware);


module.exports = app;