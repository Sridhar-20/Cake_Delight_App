const errorMiddleware = (error, req, res, next) => {
    console.error(error);

    let statusCode = error.statusCode || 500;
    let message = error.message || "Internal server error";

    // Invalid MongoDB ObjectId
    if (error.name === "CastError") {
        statusCode = 400;
        message = "Invalid ID format";
    }

    // Mongoose validation error
    if (error.name === "ValidationError") {
        statusCode = 400;
        message = "Database validation failed";
    }

    // Duplicate MongoDB key
    if (error.code === 11000) {
        statusCode = 409;
        message = "Duplicate resource";
    }

    return res.status(statusCode).json({
        success: false,
        message
    });
};

module.exports = errorMiddleware;