const express = require("express"); // Express router framework.

const {
    createCakeController,
    getAllCakesController,
    getCakeByIdController,
    updateCakeController,
    deleteCakeController,
    searchCakesController,
    getCakesByCategoryController,
    getCakesByPriceRangeController,
    getAvailableCakesController,
    updateCakeStockController,
    restoreCakeStockController
} = require("../controllers/cakeController"); // Cake controllers.

const router = express.Router(); // Creates the cake router.


/**
 * @swagger
 * /api/catalog/cakes:
 *   post:
 *     summary: Create a new cake
 *     tags: [Catalog]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CakeInput'
 *     responses:
 *       201:
 *         description: Cake created successfully
 *       400:
 *         description: Invalid cake data
 */
router.post("/", createCakeController); // Creates a new cake.


/**
 * @swagger
 * /api/catalog/cakes/search:
 *   get:
 *     summary: Search cakes by name
 *     tags: [Catalog]
 *     parameters:
 *       - in: query
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         example: Chocolate
 *     responses:
 *       200:
 *         description: Cakes matching the search term
 *       400:
 *         description: Search name is required
 */
router.get("/search", searchCakesController); // Searches cakes by name.


/**
 * @swagger
 * /api/catalog/cakes/category/{category}:
 *   get:
 *     summary: Get cakes by category
 *     tags: [Catalog]
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *         example: Birthday
 *     responses:
 *       200:
 *         description: Cakes in the requested category
 *       400:
 *         description: Category is required
 */
router.get(
    "/category/:category",
    getCakesByCategoryController
); // Gets cakes by category.


/**
 * @swagger
 * /api/catalog/cakes/filter:
 *   get:
 *     summary: Filter cakes by price range
 *     tags: [Catalog]
 *     parameters:
 *       - in: query
 *         name: min
 *         required: false
 *         schema:
 *           type: number
 *         example: 500
 *       - in: query
 *         name: max
 *         required: false
 *         schema:
 *           type: number
 *         example: 1000
 *     responses:
 *       200:
 *         description: Cakes within the price range
 *       400:
 *         description: Invalid price values
 */
router.get(
    "/filter",
    getCakesByPriceRangeController
); // Filters cakes by price.


/**
 * @swagger
 * /api/catalog/cakes/available:
 *   get:
 *     summary: Get available cakes
 *     tags: [Catalog]
 *     responses:
 *       200:
 *         description: Available cakes currently in stock
 */
router.get(
    "/available",
    getAvailableCakesController
); // Gets available cakes.


/**
 * @swagger
 * /api/catalog/cakes:
 *   get:
 *     summary: Get all cakes
 *     tags: [Catalog]
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         example: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         example: 10
 *       - in: query
 *         name: sortBy
 *         required: false
 *         schema:
 *           type: string
 *           enum:
 *             - name
 *             - price
 *             - stock
 *             - category
 *             - createdAt
 *             - updatedAt
 *         example: price
 *       - in: query
 *         name: sortOrder
 *         required: false
 *         schema:
 *           type: string
 *           enum:
 *             - asc
 *             - desc
 *         example: asc
 *     responses:
 *       200:
 *         description: List of cakes
 */
router.get("/", getAllCakesController); // Gets all cakes.



/**
 * @swagger
 * /api/catalog/cakes/{id}/stock:
 *   patch:
 *     summary: Reduce cake stock
 *     tags: [Catalog]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 507f1f77bcf86cd799439011
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 example: 2
 *     responses:
 *       200:
 *         description: Cake stock updated successfully
 *       400:
 *         description: Invalid quantity, insufficient stock, or invalid cake ID
 *       404:
 *         description: Cake not found
 */
router.patch(
    "/:id/stock",
    updateCakeStockController
);

router.patch(
    "/:id/stock/restore",
    restoreCakeStockController
);

/**
 * @swagger
 * /api/catalog/cakes/{id}:
 *   get:
 *     summary: Get a cake by ID
 *     tags: [Catalog]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Cake retrieved successfully
 *       400:
 *         description: Invalid cake ID
 *       404:
 *         description: Cake not found
 */
router.get("/:id", getCakeByIdController); // Gets a cake by ID.


/**
 * @swagger
 * /api/catalog/cakes/{id}:
 *   put:
 *     summary: Update a cake
 *     tags: [Catalog]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 507f1f77bcf86cd799439011
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CakeInput'
 *     responses:
 *       200:
 *         description: Cake updated successfully
 *       400:
 *         description: Invalid cake data or ID
 *       404:
 *         description: Cake not found
 */
router.put("/:id", updateCakeController); // Updates a cake.


/**
 * @swagger
 * /api/catalog/cakes/{id}:
 *   delete:
 *     summary: Delete a cake
 *     tags: [Catalog]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Cake deleted successfully
 *       400:
 *         description: Invalid cake ID
 *       404:
 *         description: Cake not found
 */
router.delete("/:id", deleteCakeController); // Deletes a cake.


module.exports = router; // Exports the cake router.