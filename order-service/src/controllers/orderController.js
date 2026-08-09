const orderService = require("../services/orderService");
const {
    successResponse,
    errorResponse
} = require("../utils/apiResponse");

const createOrder = async (req, res, next) => {
    try {
        const order = await orderService.createOrder(req.body);

        return successResponse(
            res,
            201,
            "Order created successfully",
            order
        );
    } catch (error) {
        next(error);
    }
};

// ==========================================================
// CHECKOUT
// ==========================================================

const checkout = async (
    req,
    res,
    next
) => {

    try {

        const order =
            await orderService.checkout(
                req.params.customerEmail,
                req.body
            );


        return successResponse(
            res,
            201,
            "Checkout completed and order created successfully",
            order
        );

    } catch (error) {

        next(error);
    }
};

const getAllOrders = async (req, res, next) => {
    try {
        const orders = await orderService.getAllOrders();

        return successResponse(
            res,
            200,
            "Orders retrieved successfully",
            orders
        );
    } catch (error) {
        next(error);
    }
};

const getOrderById = async (req, res, next) => {
    try {
        const order = await orderService.getOrderById(req.params.id);

        if (!order) {
            return errorResponse(
                res,
                404,
                "Order not found"
            );
        }

        return successResponse(
            res,
            200,
            "Order retrieved successfully",
            order
        );
    } catch (error) {
        next(error);
    }
};

const updateOrderStatus = async (req, res, next) => {
    try {
        const order = await orderService.updateOrderStatus(
            req.params.id,
            req.body.status
        );

        if (!order) {
            return errorResponse(
                res,
                404,
                "Order not found"
            );
        }

        return successResponse(
            res,
            200,
            "Order status updated successfully",
            order
        );
    } catch (error) {
        next(error);
    }
};

const cancelOrder = async (req, res, next) => {
    try {
        const order = await orderService.cancelOrder(req.params.id);

        if (!order) {
            return errorResponse(
                res,
                404,
                "Order not found"
            );
        }

        return successResponse(
            res,
            200,
            "Order cancelled successfully",
            order
        );
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createOrder,
    checkout,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    cancelOrder
};