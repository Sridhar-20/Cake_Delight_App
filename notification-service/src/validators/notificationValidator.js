const Joi = require("joi");

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

const notificationTypes = [
    "ORDER_PLACED",
    "ORDER_CONFIRMED",
    "ORDER_PREPARING",
    "ORDER_OUT_FOR_DELIVERY",
    "ORDER_DELIVERED",
    "ORDER_CANCELLED"
];

const createNotificationSchema = Joi.object({
    orderId: Joi.string()
        .pattern(objectIdPattern)
        .required()
        .messages({
            "string.empty": "Order ID is required",
            "string.pattern.base": "Order ID must be a valid MongoDB ObjectId",
            "any.required": "Order ID is required"
        }),

    customerEmail: Joi.string()
        .email()
        .required()
        .messages({
            "string.empty": "Customer email is required",
            "string.email": "Customer email must be a valid email address",
            "any.required": "Customer email is required"
        }),

    title: Joi.string()
        .trim()
        .min(1)
        .max(100)
        .required()
        .messages({
            "string.empty": "Notification title is required",
            "string.min": "Notification title cannot be empty",
            "string.max": "Notification title cannot exceed 100 characters",
            "any.required": "Notification title is required"
        }),

    message: Joi.string()
        .trim()
        .min(1)
        .max(500)
        .required()
        .messages({
            "string.empty": "Notification message is required",
            "string.min": "Notification message cannot be empty",
            "string.max": "Notification message cannot exceed 500 characters",
            "any.required": "Notification message is required"
        }),

    type: Joi.string()
        .valid(...notificationTypes)
        .required()
        .messages({
            "any.only": "Invalid notification type",
            "any.required": "Notification type is required"
        })
});

const updateNotificationStatusSchema = Joi.object({
    isRead: Joi.boolean()
        .required()
        .messages({
            "boolean.base": "isRead must be true or false",
            "any.required": "isRead is required"
        })
});

const validateCreateNotification = (data) => {
    return createNotificationSchema.validate(data, {
        abortEarly: false
    });
};

const validateUpdateNotificationStatus = (data) => {
    return updateNotificationStatusSchema.validate(data, {
        abortEarly: false
    });
};

module.exports = {
    validateCreateNotification,
    validateUpdateNotificationStatus
};