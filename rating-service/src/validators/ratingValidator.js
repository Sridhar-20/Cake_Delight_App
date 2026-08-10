const Joi = require("joi");


// ==========================================================
// CREATE RATING VALIDATION
// ==========================================================

const createRatingSchema = Joi.object({

    cakeId: Joi.string()
        .required()
        .messages({
            "string.empty":
                "Cake ID is required",

            "any.required":
                "Cake ID is required"
        }),

    customerEmail: Joi.string()
        .email()
        .required()
        .messages({
            "string.empty":
                "Customer email is required",

            "string.email":
                "Customer email must be a valid email",

            "any.required":
                "Customer email is required"
        }),

    rating: Joi.number()
        .integer()
        .min(1)
        .max(5)
        .required()
        .messages({
            "number.base":
                "Rating must be a number",

            "number.integer":
                "Rating must be an integer",

            "number.min":
                "Rating must be between 1 and 5",

            "number.max":
                "Rating must be between 1 and 5",

            "any.required":
                "Rating is required"
        }),

    review: Joi.string()
        .trim()
        .min(3)
        .max(500)
        .required()
        .messages({
            "string.empty":
                "Review is required",

            "string.min":
                "Review must contain at least 3 characters",

            "string.max":
                "Review cannot exceed 500 characters",

            "any.required":
                "Review is required"
        })

});


// ==========================================================
// UPDATE RATING VALIDATION
// ==========================================================

const updateRatingSchema = Joi.object({

    rating: Joi.number()
        .integer()
        .min(1)
        .max(5)
        .messages({
            "number.base":
                "Rating must be a number",

            "number.integer":
                "Rating must be an integer",

            "number.min":
                "Rating must be between 1 and 5",

            "number.max":
                "Rating must be between 1 and 5"
        }),

    review: Joi.string()
        .trim()
        .min(3)
        .max(500)
        .messages({
            "string.min":
                "Review must contain at least 3 characters",

            "string.max":
                "Review cannot exceed 500 characters"
        })

})
    .min(1)
    .messages({
        "object.min":
            "At least one field is required to update a rating"
    });


module.exports = {
    createRatingSchema,
    updateRatingSchema
};