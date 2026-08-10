const express = require("express");

const {
    getBasket,
    addItem,
    updateItemQuantity,
    removeItem,
    clearBasket
} = require("../controllers/basketController");

const router = express.Router();

/**
 * @swagger
 * /api/basket:
 *   post:
 *     summary: Add a cake to the customer's basket
 *     tags: [Basket]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddBasketItemInput'
 *     responses:
 *       200:
 *         description: Cake added to basket successfully
 *       201:
 *         description: Basket created and cake added successfully
 *       400:
 *         description: Invalid basket data or insufficient stock
 *       404:
 *         description: Cake not found
 */
router.post(
    "/",
    addItem
);

/**
 * @swagger
 * /api/basket/{customerEmail}:
 *   get:
 *     summary: Get a customer's basket
 *     tags: [Basket]
 *     parameters:
 *       - in: path
 *         name: customerEmail
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         example: sridhar@gmail.com
 *     responses:
 *       200:
 *         description: Basket retrieved successfully
 *       404:
 *         description: Basket not found
 */
router.get(
    "/:customerEmail",
    getBasket
);

/**
 * @swagger
 * /api/basket/{customerEmail}/{cakeId}:
 *   patch:
 *     summary: Update the quantity of a cake in the basket
 *     tags: [Basket]
 *     parameters:
 *       - in: path
 *         name: customerEmail
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         example: sridhar@gmail.com
 *
 *       - in: path
 *         name: cakeId
 *         required: true
 *         schema:
 *           type: string
 *         example: 6a76b86dc51dbe305cae2e33
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateBasketQuantityInput'
 *
 *     responses:
 *       200:
 *         description: Basket item quantity updated successfully
 *       400:
 *         description: Invalid quantity or insufficient stock
 *       404:
 *         description: Basket or cake not found
 */
router.patch(
    "/:customerEmail/:cakeId",
    updateItemQuantity
);

/**
 * @swagger
 * /api/basket/{customerEmail}/{cakeId}:
 *   delete:
 *     summary: Remove a cake from the customer's basket
 *     tags: [Basket]
 *     parameters:
 *       - in: path
 *         name: customerEmail
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         example: sridhar@gmail.com
 *
 *       - in: path
 *         name: cakeId
 *         required: true
 *         schema:
 *           type: string
 *         example: 6a76b86dc51dbe305cae2e33
 *
 *     responses:
 *       200:
 *         description: Item removed from basket successfully
 *       404:
 *         description: Basket or cake not found
 */
router.delete(
    "/:customerEmail/:cakeId",
    removeItem
);

/**
 * @swagger
 * /api/basket/{customerEmail}:
 *   delete:
 *     summary: Clear the customer's basket
 *     tags: [Basket]
 *     parameters:
 *       - in: path
 *         name: customerEmail
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         example: sridhar@gmail.com
 *
 *     responses:
 *       200:
 *         description: Basket cleared successfully
 *       404:
 *         description: Basket not found
 */
router.delete(
    "/:customerEmail",
    clearBasket
);

module.exports = router;