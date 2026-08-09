/**
 * ==========================================================
 * Cake Delight
 * Catalog Microservice
 * ----------------------------------------------------------
 * Not Found Middleware
 *
 * Handles requests for API routes that do not exist.
 *
 * Author : Bhukya Sridhar
 * ==========================================================
 */

const {
    sendErrorResponse
} = require("../utils/apiResponse");

/**
 * Handles unknown API routes.
 *
 * This middleware runs when no previously registered route
 * matches the incoming request.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} Standardized 404 response.
 */
const notFoundHandler = (req, res) => {

    return sendErrorResponse(
        res,
        404,
        `Route not found: ${req.method} ${req.originalUrl}`
    );
};

module.exports = notFoundHandler;