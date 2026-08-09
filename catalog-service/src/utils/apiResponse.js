/**
 * ==========================================================
 * Cake Delight
 * Catalog Microservice
 * ----------------------------------------------------------
 * API Response Utility
 *
 * Provides a consistent response structure for all
 * Catalog Service APIs.
 *
 * Author : Bhukya Sridhar
 * ==========================================================
 */

/**
 * Sends a successful API response.
 *
 * @param {Object} res - Express response object.
 * @param {number} statusCode - HTTP status code.
 * @param {string} message - Success message.
 * @param {*} data - Response data.
 * @returns {Object} Express response.
 */
const sendSuccessResponse = (res, statusCode, message, data = null) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
};

/**
 * Sends an error API response.
 *
 * @param {Object} res - Express response object.
 * @param {number} statusCode - HTTP status code.
 * @param {string} message - Error message.
 * @param {*} errors - Optional detailed validation errors.
 * @returns {Object} Express response.
 */
const sendErrorResponse = (
    res,
    statusCode,
    message,
    errors = null
) => {
    return res.status(statusCode).json({
        success: false,
        message,
        errors
    });
};

module.exports = {
    sendSuccessResponse,
    sendErrorResponse
};