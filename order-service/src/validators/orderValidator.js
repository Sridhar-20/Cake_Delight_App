const mongoose = require("mongoose");

const validateCreateOrder = (req, res, next) => {
    const {
        customerName,
        customerEmail,
        customerPhone,
        items,
        deliveryAddress,
        paymentMethod
    } = req.body;

    if (!customerName || !customerName.trim()) {
        return res.status(400).json({
            success: false,
            message: "Customer name is required"
        });
    }

    if (!customerEmail || !customerEmail.trim()) {
        return res.status(400).json({
            success: false,
            message: "Customer email is required"
        });
    }

    if (!customerPhone || !customerPhone.trim()) {
        return res.status(400).json({
            success: false,
            message: "Customer phone is required"
        });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
            success: false,
            message: "At least one order item is required"
        });
    }

    if (!deliveryAddress || !deliveryAddress.trim()) {
        return res.status(400).json({
            success: false,
            message: "Delivery address is required"
        });
    }

    if (!paymentMethod) {
        return res.status(400).json({
            success: false,
            message: "Payment method is required"
        });
    }

    const validPaymentMethods = [
        "COD",
        "ONLINE"
    ];

    if (!validPaymentMethods.includes(paymentMethod)) {
        return res.status(400).json({
            success: false,
            message: "Payment method must be COD or ONLINE"
        });
    }

    for (const item of items) {

        if (!item.cakeId) {
            return res.status(400).json({
                success: false,
                message: "Cake ID is required for every item"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(item.cakeId)) {
            return res.status(400).json({
                success: false,
                message: `Invalid cake ID: ${item.cakeId}`
            });
        }

        if (
            !Number.isInteger(item.quantity) ||
            item.quantity < 1
        ) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be a positive integer"
            });
        }
    }

    next();
};

const validateUpdateStatus = (req, res, next) => {
    const { status } = req.body;

    const validStatuses = [
        "PLACED",
        "CONFIRMED",
        "PREPARING",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "CANCELLED"
    ];

    if (!status) {
        return res.status(400).json({
            success: false,
            message: "Status is required"
        });
    }

    if (!validStatuses.includes(status)) {
        return res.status(400).json({
            success: false,
            message: "Invalid order status"
        });
    }

    next();
};

module.exports = {
    validateCreateOrder,
    validateUpdateStatus
};