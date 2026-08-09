const Notification = require("../models/Notification");

const createNotification = async (notificationData) => {

    const notification =
        await Notification.create(
            notificationData
        );

    return notification;
};

const createNotificationFromEvent = async (event) => {

    if (!event || !event.eventType || !event.payload) {
        throw new Error("Invalid notification event");
    }

    const {
        orderId,
        customerEmail,
        status
    } = event.payload;

    if (!orderId || !customerEmail) {
        throw new Error(
            "Notification event is missing orderId or customerEmail"
        );
    }

    // Prevent duplicate notification creation when RabbitMQ
    // redelivers the same event.
    if (event.eventId) {

        const existing =
            await Notification.findOne({
                eventId: event.eventId
            });

        if (existing) {
            return existing;
        }
    }

    let details = null;

    if (event.eventType === "ORDER_COMPLETED") {

        details = {
            title: "Order Placed",
            message:
                `Your Cake Delight order ${orderId} has been placed successfully.`,
            type: "ORDER_PLACED"
        };

    } else if (
        event.eventType === "ORDER_STATUS_UPDATED"
    ) {

        const statusNotifications = {

            CONFIRMED: {
                title: "Order Confirmed",
                message:
                    `Your Cake Delight order ${orderId} has been confirmed.`,
                type: "ORDER_CONFIRMED"
            },

            PREPARING: {
                title: "Order Preparing",
                message:
                    `Your Cake Delight order ${orderId} is now being prepared.`,
                type: "ORDER_PREPARING"
            },

            OUT_FOR_DELIVERY: {
                title: "Order Out for Delivery",
                message:
                    `Your Cake Delight order ${orderId} is out for delivery.`,
                type: "ORDER_OUT_FOR_DELIVERY"
            },

            DELIVERED: {
                title: "Order Delivered",
                message:
                    `Your Cake Delight order ${orderId} has been delivered. Enjoy your cake!`,
                type: "ORDER_DELIVERED"
            },

            CANCELLED: {
                title: "Order Cancelled",
                message:
                    `Your Cake Delight order ${orderId} has been cancelled successfully.`,
                type: "ORDER_CANCELLED"
            }
        };

        details = statusNotifications[status];
    }

    // Ignore events that are not relevant to notifications.
    if (!details) {
        return null;
    }

    return await createNotification({
        eventId: event.eventId,
        orderId,
        customerEmail,
        title: details.title,
        message: details.message,
        type: details.type
    });
};

const getAllNotifications = async () => {

    return await Notification.find()
        .sort({ createdAt: -1 });
};

const getNotificationById = async (notificationId) => {

    const notification =
        await Notification.findById(
            notificationId
        );

    if (!notification) {

        const error =
            new Error(
                "Notification not found"
            );

        error.statusCode = 404;

        throw error;
    }

    return notification;
};

const getNotificationsByCustomer = async (
    customerEmail
) => {

    return await Notification.find({
        customerEmail:
            customerEmail.toLowerCase()
    }).sort({
        createdAt: -1
    });
};

const markNotificationAsRead = async (
    notificationId
) => {

    const notification =
        await Notification.findByIdAndUpdate(
            notificationId,
            {
                isRead: true
            },
            {
                new: true,
                runValidators: true
            }
        );

    if (!notification) {

        const error =
            new Error(
                "Notification not found"
            );

        error.statusCode = 404;

        throw error;
    }

    return notification;
};

const deleteNotification = async (
    notificationId
) => {

    const notification =
        await Notification.findByIdAndDelete(
            notificationId
        );

    if (!notification) {

        const error =
            new Error(
                "Notification not found"
            );

        error.statusCode = 404;

        throw error;
    }

    return notification;
};

module.exports = {
    createNotification,
    createNotificationFromEvent,
    getAllNotifications,
    getNotificationById,
    getNotificationsByCustomer,
    markNotificationAsRead,
    deleteNotification
};
