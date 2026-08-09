const notificationService = require("../services/notificationService");

const {
    validateCreateNotification,
    validateUpdateNotificationStatus
} = require("../validators/notificationValidator");

const {
    successResponse,
    errorResponse
} = require("../utils/apiResponse");


const createNotification = async (req, res, next) => {
    try {
        const { error, value } = validateCreateNotification(req.body);

        if (error) {
            return errorResponse(
                res,
                400,
                "Validation failed",
                error.details.map((detail) => detail.message)
            );
        }

        const notification =
            await notificationService.createNotification(value);

        return successResponse(
            res,
            201,
            "Notification created successfully",
            notification
        );
    } catch (error) {
        next(error);
    }
};


const getAllNotifications = async (req, res, next) => {
    try {
        const notifications =
            await notificationService.getAllNotifications();

        return successResponse(
            res,
            200,
            "Notifications retrieved successfully",
            notifications
        );
    } catch (error) {
        next(error);
    }
};


const getNotificationById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const notification =
            await notificationService.getNotificationById(id);

        return successResponse(
            res,
            200,
            "Notification retrieved successfully",
            notification
        );
    } catch (error) {
        next(error);
    }
};


const getNotificationsByCustomer = async (req, res, next) => {
    try {
        const { email } = req.params;

        const notifications =
            await notificationService.getNotificationsByCustomer(email);

        return successResponse(
            res,
            200,
            "Customer notifications retrieved successfully",
            notifications
        );
    } catch (error) {
        next(error);
    }
};


const markNotificationAsRead = async (req, res, next) => {
    try {
        const { id } = req.params;

        const { error, value } =
            validateUpdateNotificationStatus(req.body);

        if (error) {
            return errorResponse(
                res,
                400,
                "Validation failed",
                error.details.map((detail) => detail.message)
            );
        }

        const notification =
            await notificationService.markNotificationAsRead(id);

        return successResponse(
            res,
            200,
            "Notification marked as read",
            notification
        );
    } catch (error) {
        next(error);
    }
};


const deleteNotification = async (req, res, next) => {
    try {
        const { id } = req.params;

        const notification =
            await notificationService.deleteNotification(id);

        return successResponse(
            res,
            200,
            "Notification deleted successfully",
            notification
        );
    } catch (error) {
        next(error);
    }
};


module.exports = {
    createNotification,
    getAllNotifications,
    getNotificationById,
    getNotificationsByCustomer,
    markNotificationAsRead,
    deleteNotification
};