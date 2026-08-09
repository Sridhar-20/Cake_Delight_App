const mongoose = require("mongoose"); // MongoDB ObjectId validation.

const {
    sendSuccessResponse,
    sendErrorResponse
} = require("../utils/apiResponse"); // Standard API response helpers.

const {
    validateCreateCake,
    validateUpdateCake
} = require("../validators/cakeValidator"); // Cake request validators.

const {
    createCake,
    getAllCakes,
    getCakeById,
    updateCake,
    deleteCake,
    searchCakesByName,
    getCakesByCategory,
    getCakesByPriceRange,
    getAvailableCakes,
    updateCakeStock,
    restoreCakeStock
} = require("../services/cakeService"); // Cake business logic.

const createCakeController = async (req, res, next) => { // Creates a new cake.
    try {

        const { error, value } = validateCreateCake(req.body);

        if (error) {

            const validationErrors = error.details.map(
                (detail) => detail.message
            );

            return sendErrorResponse(
                res,
                400,
                "Invalid cake data",
                validationErrors
            );
        }

        const cake = await createCake(value);

        return sendSuccessResponse(
            res,
            201,
            "Cake created successfully",
            cake
        );

    } catch (error) {
        next(error);
    }
};


const getAllCakesController = async (req, res, next) => { // Retrieves all cakes.
    try {

        const page = Math.max(
            parseInt(req.query.page) || 1,
            1
        );

        const limit = Math.min(
            Math.max(parseInt(req.query.limit) || 10, 1),
            100
        );

        const sortBy = req.query.sortBy || "createdAt";

        const sortOrder =
            req.query.sortOrder === "asc"
                ? "asc"
                : "desc";

        const result = await getAllCakes({
            page,
            limit,
            sortBy,
            sortOrder
        });

        return sendSuccessResponse(
            res,
            200,
            "Cakes retrieved successfully",
            result
        );

    } catch (error) {
        next(error);
    }
};


const getCakeByIdController = async (req, res, next) => { // Retrieves a cake by ID.
    try {

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {

            return sendErrorResponse(
                res,
                400,
                "Invalid cake ID"
            );
        }

        const cake = await getCakeById(id);

        if (!cake) {

            return sendErrorResponse(
                res,
                404,
                "Cake not found"
            );
        }

        return sendSuccessResponse(
            res,
            200,
            "Cake retrieved successfully",
            cake
        );

    } catch (error) {
        next(error);
    }
};


const updateCakeController = async (req, res, next) => { // Updates an existing cake.
    try {

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {

            return sendErrorResponse(
                res,
                400,
                "Invalid cake ID"
            );
        }

        const { error, value } = validateUpdateCake(req.body);

        if (error) {

            const validationErrors = error.details.map(
                (detail) => detail.message
            );

            return sendErrorResponse(
                res,
                400,
                "Invalid cake update data",
                validationErrors
            );
        }

        const updatedCake = await updateCake(id, value);

        if (!updatedCake) {

            return sendErrorResponse(
                res,
                404,
                "Cake not found"
            );
        }

        return sendSuccessResponse(
            res,
            200,
            "Cake updated successfully",
            updatedCake
        );

    } catch (error) {
        next(error);
    }
};


const deleteCakeController = async (req, res, next) => { // Deletes an existing cake.
    try {

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {

            return sendErrorResponse(
                res,
                400,
                "Invalid cake ID"
            );
        }

        const deletedCake = await deleteCake(id);

        if (!deletedCake) {

            return sendErrorResponse(
                res,
                404,
                "Cake not found"
            );
        }

        return sendSuccessResponse(
            res,
            200,
            "Cake deleted successfully",
            deletedCake
        );

    } catch (error) {
        next(error);
    }
};


const searchCakesController = async (req, res, next) => { // Searches cakes by name.
    try {

        const name = req.query.name?.trim();

        if (!name) {

            return sendErrorResponse(
                res,
                400,
                "Search name is required"
            );
        }

        const cakes = await searchCakesByName(name);

        return sendSuccessResponse(
            res,
            200,
            "Cake search completed successfully",
            {
                count: cakes.length,
                cakes
            }
        );

    } catch (error) {
        next(error);
    }
};


const getCakesByCategoryController = async (req, res, next) => { // Retrieves cakes by category.
    try {

        const category = req.params.category?.trim();

        if (!category) {

            return sendErrorResponse(
                res,
                400,
                "Cake category is required"
            );
        }

        const cakes = await getCakesByCategory(category);

        return sendSuccessResponse(
            res,
            200,
            "Cakes retrieved by category successfully",
            {
                category,
                count: cakes.length,
                cakes
            }
        );

    } catch (error) {
        next(error);
    }
};


const getCakesByPriceRangeController = async (req, res, next) => { // Filters cakes by price range.
    try {

        const minValue = req.query.min;
        const maxValue = req.query.max;

        // Require at least one price boundary.
        if (minValue === undefined && maxValue === undefined) {

            return sendErrorResponse(
                res,
                400,
                "At least one price value is required"
            );
        }

        const minPrice =
            minValue !== undefined
                ? Number(minValue)
                : undefined;

        const maxPrice =
            maxValue !== undefined
                ? Number(maxValue)
                : undefined;

        // Validate price values.
        if (
            (minPrice !== undefined && !Number.isFinite(minPrice)) ||
            (maxPrice !== undefined && !Number.isFinite(maxPrice))
        ) {

            return sendErrorResponse(
                res,
                400,
                "Price values must be valid numbers"
            );
        }

        // Prevent negative minimum prices.
        if (
            minPrice !== undefined &&
            minPrice < 0
        ) {

            return sendErrorResponse(
                res,
                400,
                "Minimum price cannot be negative"
            );
        }

        // Prevent negative maximum prices.
        if (
            maxPrice !== undefined &&
            maxPrice < 0
        ) {

            return sendErrorResponse(
                res,
                400,
                "Maximum price cannot be negative"
            );
        }

        // Ensure minimum price does not exceed maximum price.
        if (
            minPrice !== undefined &&
            maxPrice !== undefined &&
            minPrice > maxPrice
        ) {

            return sendErrorResponse(
                res,
                400,
                "Minimum price cannot be greater than maximum price"
            );
        }

        const cakes = await getCakesByPriceRange(
            minPrice,
            maxPrice
        );

        return sendSuccessResponse(
            res,
            200,
            "Cakes filtered by price successfully",
            {
                minPrice,
                maxPrice,
                count: cakes.length,
                cakes
            }
        );

    } catch (error) {
        next(error);
    }
};


const getAvailableCakesController = async (req, res, next) => { // Retrieves available cakes.
    try {

        const cakes = await getAvailableCakes();

        return sendSuccessResponse(
            res,
            200,
            "Available cakes retrieved successfully",
            {
                count: cakes.length,
                cakes
            }
        );

    } catch (error) {
        next(error);
    }
};
const updateCakeStockController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendErrorResponse(
                res,
                400,
                "Invalid cake ID"
            );
        }

        if (
            !Number.isInteger(quantity) ||
            quantity <= 0
        ) {
            return sendErrorResponse(
                res,
                400,
                "Quantity must be a positive integer"
            );
        }

        const updatedCake = await updateCakeStock(
            id,
            quantity
        );

        if (!updatedCake) {
            return sendErrorResponse(
                res,
                400,
                "Insufficient stock or cake not found"
            );
        }

        return sendSuccessResponse(
            res,
            200,
            "Cake stock updated successfully",
            updatedCake
        );

    } catch (error) {
        next(error);
    }
};

const restoreCakeStockController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendErrorResponse(
                res,
                400,
                "Invalid cake ID"
            );
        }

        if (
            !Number.isInteger(quantity) ||
            quantity <= 0
        ) {
            return sendErrorResponse(
                res,
                400,
                "Quantity must be a positive integer"
            );
        }

        const updatedCake = await restoreCakeStock(
            id,
            quantity
        );

        if (!updatedCake) {
            return sendErrorResponse(
                res,
                404,
                "Cake not found"
            );
        }

        return sendSuccessResponse(
            res,
            200,
            "Cake stock restored successfully",
            updatedCake
        );

    } catch (error) {
        next(error);
    }
};

module.exports = {
    createCakeController,
    getAllCakesController,
    getCakeByIdController,
    updateCakeStockController,
    updateCakeController,
    deleteCakeController,
    searchCakesController,
    getCakesByCategoryController,
    getCakesByPriceRangeController,
    getAvailableCakesController,
    restoreCakeStockController
};