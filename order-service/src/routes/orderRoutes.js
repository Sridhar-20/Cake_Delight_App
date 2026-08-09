const express = require("express");

const {
    createOrder,
    checkout,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    cancelOrder
} = require("../controllers/orderController");

const router = express.Router();


/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderInput'
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Invalid order data, unavailable cake, or insufficient stock
 *       404:
 *         description: Cake not found
 */
router.post(
    "/",
    createOrder
);


/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 */
router.get(
    "/",
    getAllOrders
);

// ==========================================================
// CHECKOUT
// ==========================================================

router.post(
    "/checkout/:customerEmail",
    checkout
);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get an order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 6a773cbcf0240e24a91ee059
 *     responses:
 *       200:
 *         description: Order retrieved successfully
 *       404:
 *         description: Order not found
 */
router.get(
    "/:id",
    getOrderById
);


/**
 * @swagger
 * /api/orders/{id}/status:
 *   patch:
 *     summary: Update order status
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 6a773cbcf0240e24a91ee059
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateOrderStatusInput'
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       400:
 *         description: Invalid status transition
 *       404:
 *         description: Order not found
 */
router.patch(
    "/:id/status",
    updateOrderStatus
);


/**
 * @swagger
 * /api/orders/{id}/cancel:
 *   patch:
 *     summary: Cancel an order
 *     description: Cancels an order and restores the ordered cake quantities to the Catalog Service stock.
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 6a773cbcf0240e24a91ee059
 *     responses:
 *       200:
 *         description: Order cancelled successfully and cake stock restored
 *       400:
 *         description: Order cannot be cancelled in its current status
 *       404:
 *         description: Order not found
 */
router.patch(
    "/:id/cancel",
    cancelOrder
);


module.exports = router;