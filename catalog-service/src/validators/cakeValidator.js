/**
 * ==========================================================
 * Cake Delight
 * Catalog Microservice
 * ----------------------------------------------------------
 * Cake Request Validator
 *
 * Defines validation rules for incoming cake requests.
 *
 * Author : Bhukya Sridhar
 * ==========================================================
 */

const Joi = require("joi");

/**
 * Validation schema for creating a cake.
 */
const createCakeSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required()
        .messages({
            "string.empty": "Cake name is required",
            "string.min": "Cake name must contain at least 2 characters",
            "string.max": "Cake name cannot exceed 100 characters",
            "any.required": "Cake name is required"
        }),

    description: Joi.string()
        .trim()
        .max(500)
        .required()
        .messages({
            "string.empty": "Cake description is required",
            "string.max": "Cake description cannot exceed 500 characters",
            "any.required": "Cake description is required"
        }),

    category: Joi.string()
        .trim()
        .required()
        .messages({
            "string.empty": "Cake category is required",
            "any.required": "Cake category is required"
        }),

    price: Joi.number()
        .positive()
        .required()
        .messages({
            "number.positive": "Cake price must be greater than 0",
            "any.required": "Cake price is required"
        }),

    stock: Joi.number()
        .integer()
        .min(0)
        .required()
        .messages({
            "number.integer": "Stock must be a whole number",
            "number.min": "Stock cannot be negative",
            "any.required": "Cake stock is required"
        }),

    imageUrl: Joi.string()
        .trim()
        .allow("")
        .optional(),

    isAvailable: Joi.boolean()
        .optional()
});

/**
 * Validation schema for updating a cake.
 *
 * All fields are optional because the client can update
 * only the fields that need to be changed.
 */
const updateCakeSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .messages({
            "string.min": "Cake name must contain at least 2 characters",
            "string.max": "Cake name cannot exceed 100 characters"
        }),

    description: Joi.string()
        .trim()
        .max(500)
        .messages({
            "string.max": "Cake description cannot exceed 500 characters"
        }),

    category: Joi.string()
        .trim()
        .messages({
            "string.empty": "Cake category cannot be empty"
        }),

    price: Joi.number()
        .positive()
        .messages({
            "number.positive": "Cake price must be greater than 0"
        }),

    stock: Joi.number()
        .integer()
        .min(0)
        .messages({
            "number.integer": "Stock must be a whole number",
            "number.min": "Stock cannot be negative"
        }),

    imageUrl: Joi.string()
        .trim()
        .allow("")
        .optional(),

    isAvailable: Joi.boolean()
        .optional()
})
    .min(1)
    .messages({
        "object.min": "At least one field is required for update"
    });

/**
 * Validates data used to create a cake.
 *
 * @param {Object} data - Cake request data.
 * @returns {Object} Joi validation result.
 */
const validateCreateCake = (data) => {
    return createCakeSchema.validate(data, {
        abortEarly: false,
        stripUnknown: true
    });
};

/**
 * Validates data used to update a cake.
 *
 * @param {Object} data - Cake update data.
 * @returns {Object} Joi validation result.
 */
const validateUpdateCake = (data) => {
    return updateCakeSchema.validate(data, {
        abortEarly: false,
        stripUnknown: true
    });
};

module.exports = {
    validateCreateCake,
    validateUpdateCake
};