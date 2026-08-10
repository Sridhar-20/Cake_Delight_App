const express = require("express");

const {
    createRating,
    getAllRatings,
    getRatingById,
    getRatingsByCake,
    updateRating,
    deleteRating
} = require("../controllers/ratingController");

const {
    createRatingSchema,
    updateRatingSchema
} = require("../validators/ratingValidator");

const validate =
    require("../middleware/validationMiddleware");

const router = express.Router();


// ==========================================================
// CREATE RATING
// ==========================================================

/**
 * @swagger
 * /api/ratings:
 *   post:
 *     summary: Create a new rating
 *     description: Creates a customer rating and review for a cake.
 *     tags:
 *       - Ratings
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RatingInput'
 *     responses:
 *       201:
 *         description: Rating created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Invalid rating data or customer has already rated the cake
 *       500:
 *         description: Internal server error
 */
router.post(
    "/",
    validate(createRatingSchema),
    createRating
);


// ==========================================================
// GET ALL RATINGS
// ==========================================================

/**
 * @swagger
 * /api/ratings:
 *   get:
 *     summary: Get all ratings
 *     description: Retrieves all customer ratings.
 *     tags:
 *       - Ratings
 *     responses:
 *       200:
 *         description: Ratings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       500:
 *         description: Internal server error
 */
router.get(
    "/",
    getAllRatings
);


// ==========================================================
// GET RATINGS BY CAKE
// ==========================================================

/**
 * @swagger
 * /api/ratings/cake/{cakeId}:
 *   get:
 *     summary: Get ratings for a cake
 *     description: Retrieves all ratings and reviews for a specific cake.
 *     tags:
 *       - Ratings
 *     parameters:
 *       - in: path
 *         name: cakeId
 *         required: true
 *         description: MongoDB ID of the cake
 *         schema:
 *           type: string
 *         example: 66a76b86dc51dbe305cae2e33
 *     responses:
 *       200:
 *         description: Cake ratings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       500:
 *         description: Internal server error
 */
router.get(
    "/cake/:cakeId",
    getRatingsByCake
);


// ==========================================================
// GET RATING BY ID
// ==========================================================

/**
 * @swagger
 * /api/ratings/{id}:
 *   get:
 *     summary: Get rating by ID
 *     description: Retrieves a single rating using its ID.
 *     tags:
 *       - Ratings
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ID of the rating
 *         schema:
 *           type: string
 *         example: 66a78312cb19b7e0598b590d1
 *     responses:
 *       200:
 *         description: Rating retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Invalid rating ID
 *       404:
 *         description: Rating not found
 *       500:
 *         description: Internal server error
 */
router.get(
    "/:id",
    getRatingById
);


// ==========================================================
// UPDATE RATING
// ==========================================================

/**
 * @swagger
 * /api/ratings/{id}:
 *   patch:
 *     summary: Update a rating
 *     description: Updates the rating and/or review of an existing customer rating.
 *     tags:
 *       - Ratings
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ID of the rating
 *         schema:
 *           type: string
 *         example: 66a78312cb19b7e0598b590d1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateRatingInput'
 *     responses:
 *       200:
 *         description: Rating updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Invalid rating data
 *       404:
 *         description: Rating not found
 *       500:
 *         description: Internal server error
 */
router.patch(
    "/:id",
    validate(updateRatingSchema),
    updateRating
);


// ==========================================================
// DELETE RATING
// ==========================================================

/**
 * @swagger
 * /api/ratings/{id}:
 *   delete:
 *     summary: Delete a rating
 *     description: Deletes an existing customer rating.
 *     tags:
 *       - Ratings
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ID of the rating
 *         schema:
 *           type: string
 *         example: 66a78312cb19b7e0598b590d1
 *     responses:
 *       200:
 *         description: Rating deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Invalid rating ID
 *       404:
 *         description: Rating not found
 *       500:
 *         description: Internal server error
 */
router.delete(
    "/:id",
    deleteRating
);


module.exports = router;