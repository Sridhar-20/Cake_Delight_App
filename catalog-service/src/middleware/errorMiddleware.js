/**
 * ==========================================================
 * Cake Delight
 * Catalog Microservice
 * ----------------------------------------------------------
 * Global Error Handling Middleware
 *
 * Handles application, MongoDB, Mongoose and unexpected
 * errors in a centralized location.
 *
 * Author : Bhukya Sridhar
 * ==========================================================
 */

const {
    sendErrorResponse
} = require("../utils/apiResponse");

/**
 * Global error handling middleware.
 *
 * This middleware should be registered after all application
 * routes.
 *
 * @param {Error} error - Error object.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Object} Standardized error response.
 */
const errorHandler = (error, req, res, next) => {

    console.error("❌ Application Error:");
    console.error(error);

    /**
     * ======================================================
     * Mongoose Validation Error
     * ======================================================
     */
    if (error.name === "ValidationError") {

        const validationErrors = Object.values(
            error.errors
        ).map((validationError) => validationError.message);

        return sendErrorResponse(
            res,
            400,
            "Database validation failed",
            validationErrors
        );
    }

    /**
     * ======================================================
     * Invalid MongoDB ObjectId
     * ======================================================
     */
    if (error.name === "CastError") {

        return sendErrorResponse(
            res,
            400,
            "Invalid resource ID"
        );
    }

    /**
     * ======================================================
     * MongoDB Duplicate Key Error
     * ======================================================
     */
    if (error.code === 11000) {

        return sendErrorResponse(
            res,
            409,
            "Duplicate resource already exists"
        );
    }

    /**
     * ======================================================
     * Generic Application Error
     * ======================================================
     */
    return sendErrorResponse(
        res,
        error.statusCode || 500,
        error.message || "Internal server error"
    );
};

module.exports = errorHandler;