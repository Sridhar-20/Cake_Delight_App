const Order = require("../models/Order");

const {
    getCakeById,
    reduceCakeStock,
    restoreCakeStock
} = require("./catalogService");

const {
    getBasket,
    clearBasket
} = require("./basketService");

const {
    publishEvent
} = require("./messageBroker");


// ==========================================================
// CREATE ORDER
// ==========================================================

const createOrder = async (orderData) => {

    const { items } = orderData;

    let totalAmount = 0;

    const processedItems = [];


    // ------------------------------------------------------
    // Validate all cakes and calculate order total.
    // ------------------------------------------------------

    for (const item of items) {

        const cake = await getCakeById(item.cakeId);


        if (!cake) {

            const error = new Error(
                `Cake not found: ${item.cakeId}`
            );

            error.statusCode = 404;

            throw error;
        }


        if (!cake.isAvailable) {

            const error = new Error(
                `Cake is currently unavailable: ${cake.name}`
            );

            error.statusCode = 400;

            throw error;
        }


        if (cake.stock < item.quantity) {

            const error = new Error(
                `Insufficient stock for cake: ${cake.name}`
            );

            error.statusCode = 400;

            throw error;
        }


        const subtotal =
            cake.price * item.quantity;


        totalAmount += subtotal;


        processedItems.push({
            cakeId: cake._id,
            cakeName: cake.name,
            price: cake.price,
            quantity: item.quantity,
            subtotal
        });
    }


    // ------------------------------------------------------
    // Reduce stock for every cake in the order.
    // ------------------------------------------------------

    for (const item of items) {

        await reduceCakeStock(
            item.cakeId,
            item.quantity
        );
    }


    // ------------------------------------------------------
    // Create the order after stock is successfully reduced.
    // ------------------------------------------------------

    const order = await Order.create({

        customerName:
            orderData.customerName,

        customerEmail:
            orderData.customerEmail,

        customerPhone:
            orderData.customerPhone,

        items:
            processedItems,

        totalAmount,

        deliveryAddress:
            orderData.deliveryAddress,

        paymentMethod:
            orderData.paymentMethod
    });


    // ------------------------------------------------------
    // Publish order completion event.
    // ------------------------------------------------------

    await publishEvent(
        "ORDER_COMPLETED",
        {
            orderId: order._id.toString(),
            customerName: order.customerName,
            customerEmail: order.customerEmail,
            customerPhone: order.customerPhone,
            items: order.items,
            totalAmount: order.totalAmount,
            deliveryAddress: order.deliveryAddress,
            paymentMethod: order.paymentMethod,
            status: order.status
        }
    );


    return order;
};



// ==========================================================
// CHECKOUT
// ==========================================================

const checkout = async (
    customerEmail,
    checkoutData
) => {

    // ------------------------------------------------------
    // Get customer's basket.
    // ------------------------------------------------------

    const basket =
        await getBasket(
            customerEmail
        );


    // ------------------------------------------------------
    // Basket must contain at least one item.
    // ------------------------------------------------------

    if (
        !basket ||
        basket.items.length === 0
    ) {

        const error =
            new Error(
                "Cannot checkout with an empty basket"
            );

        error.statusCode = 400;

        throw error;
    }


    // ------------------------------------------------------
    // Convert basket items into order items.
    //
    // IMPORTANT:
    // We only take cakeId and quantity here.
    //
    // createOrder() will contact Catalog Service again
    // and get the latest:
    //
    // - cake name
    // - price
    // - availability
    // - stock
    // ------------------------------------------------------

    const orderItems =
        basket.items.map(
            item => ({
                cakeId:
                    item.cakeId.toString(),

                quantity:
                    item.quantity
            })
        );


    // ------------------------------------------------------
    // Create order using the existing order workflow.
    // ------------------------------------------------------

    const order =
        await createOrder({

            customerName:
                checkoutData.customerName,

            customerEmail,

            customerPhone:
                checkoutData.customerPhone,

            items:
                orderItems,

            deliveryAddress:
                checkoutData.deliveryAddress,

            paymentMethod:
                checkoutData.paymentMethod
        });


    // ------------------------------------------------------
    // Order was successfully created.
    //
    // Now clear the basket.
    // ------------------------------------------------------

    await clearBasket(
        customerEmail
    );


    return order;
};


// ==========================================================
// GET ALL ORDERS
// ==========================================================

const getAllOrders = async () => {

    return await Order.find().sort({
        createdAt: -1
    });
};


// ==========================================================
// GET ORDER BY ID
// ==========================================================

const getOrderById = async (orderId) => {

    return await Order.findById(orderId);
};


// ==========================================================
// UPDATE ORDER STATUS
// ==========================================================

const updateOrderStatus = async (
    orderId,
    newStatus
) => {

    const order =
        await Order.findById(orderId);


    if (!order) {
        return null;
    }


    const currentStatus =
        order.status;


    const allowedTransitions = {

        PLACED: [
            "CONFIRMED",
            "CANCELLED"
        ],

        CONFIRMED: [
            "PREPARING",
            "CANCELLED"
        ],

        PREPARING: [
            "OUT_FOR_DELIVERY",
            "CANCELLED"
        ],

        OUT_FOR_DELIVERY: [
            "DELIVERED"
        ],

        DELIVERED: [],

        CANCELLED: []
    };


    const allowedStatuses =
        allowedTransitions[currentStatus] || [];


    if (!allowedStatuses.includes(newStatus)) {

        const error = new Error(
            `Cannot change order status from ${currentStatus} to ${newStatus}`
        );

        error.statusCode = 400;

        throw error;
    }


    order.status = newStatus;

    await order.save();


    // ------------------------------------------------------
    // Publish status event for Notification Service.
    // ------------------------------------------------------

    await publishEvent(
        "ORDER_STATUS_UPDATED",
        {
            orderId: order._id.toString(),
            customerName: order.customerName,
            customerEmail: order.customerEmail,
            status: order.status,
            totalAmount: order.totalAmount
        }
    );


    return order;
};


// ==========================================================
// CANCEL ORDER
// ==========================================================

const cancelOrder = async (orderId) => {

    const order =
        await Order.findById(orderId);


    if (!order) {
        return null;
    }


    if (
        order.status === "DELIVERED" ||
        order.status === "CANCELLED"
    ) {

        const error = new Error(
            `Order cannot be cancelled when status is ${order.status}`
        );

        error.statusCode = 400;

        throw error;
    }


    // ------------------------------------------------------
    // Restore stock for every cake in the order.
    // ------------------------------------------------------

    for (const item of order.items) {

        await restoreCakeStock(
            item.cakeId,
            item.quantity
        );
    }


    order.status = "CANCELLED";

    await order.save();


    // ------------------------------------------------------
    // Publish cancellation event.
    // ------------------------------------------------------

    await publishEvent(
        "ORDER_STATUS_UPDATED",
        {
            orderId: order._id.toString(),
            customerName: order.customerName,
            customerEmail: order.customerEmail,
            status: order.status,
            totalAmount: order.totalAmount
        }
    );


    return order;
};


module.exports = {
    createOrder,
    checkout,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    cancelOrder
};
