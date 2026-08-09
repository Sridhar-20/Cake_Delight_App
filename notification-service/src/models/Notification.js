const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        eventId: {
            type: String,
            trim: true,
            unique: true,
            sparse: true
        },

        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },

        customerEmail: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        message: {
            type: String,
            required: true,
            trim: true
        },

        type: {
            type: String,
            required: true,
            enum: [
                "ORDER_PLACED",
                "ORDER_CONFIRMED",
                "ORDER_PREPARING",
                "ORDER_OUT_FOR_DELIVERY",
                "ORDER_DELIVERED",
                "ORDER_CANCELLED"
            ]
        },

        isRead: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Notification",
    notificationSchema
);
