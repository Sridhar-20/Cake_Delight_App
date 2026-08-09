const basketService =
    require("../services/basketService");

const {
    successResponse,
    errorResponse
} = require("../utils/apiResponse");


// ==========================================================
// GET BASKET
// ==========================================================

const getBasket = async (
    req,
    res,
    next
) => {

    try {

        const basket =
            await basketService.getBasket(
                req.params.customerEmail
            );


        return successResponse(
            res,
            200,
            "Basket retrieved successfully",
            basket
        );

    } catch (error) {

        next(error);
    }
};


// ==========================================================
// ADD ITEM
// ==========================================================

const addItem = async (
    req,
    res,
    next
) => {

    try {

        const {
            customerEmail,
            cakeId,
            quantity
        } = req.body;


        const basket =
            await basketService.addItem(
                customerEmail,
                cakeId,
                quantity
            );


        return successResponse(
            res,
            201,
            "Cake added to basket successfully",
            basket
        );

    } catch (error) {

        next(error);
    }
};


// ==========================================================
// UPDATE ITEM QUANTITY
// ==========================================================

const updateItemQuantity = async (
    req,
    res,
    next
) => {

    try {

        const basket =
            await basketService.updateItemQuantity(
                req.params.customerEmail,
                req.params.cakeId,
                req.body.quantity
            );


        if (!basket) {

            return errorResponse(
                res,
                404,
                "Basket item not found"
            );
        }


        return successResponse(
            res,
            200,
            "Basket item updated successfully",
            basket
        );

    } catch (error) {

        next(error);
    }
};


// ==========================================================
// REMOVE ITEM
// ==========================================================

const removeItem = async (
    req,
    res,
    next
) => {

    try {

        const basket =
            await basketService.removeItem(
                req.params.customerEmail,
                req.params.cakeId
            );


        if (!basket) {

            return errorResponse(
                res,
                404,
                "Basket item not found"
            );
        }


        return successResponse(
            res,
            200,
            "Cake removed from basket successfully",
            basket
        );

    } catch (error) {

        next(error);
    }
};


// ==========================================================
// CLEAR BASKET
// ==========================================================

const clearBasket = async (
    req,
    res,
    next
) => {

    try {

        const basket =
            await basketService.clearBasket(
                req.params.customerEmail
            );


        if (!basket) {

            return errorResponse(
                res,
                404,
                "Basket not found"
            );
        }


        return successResponse(
            res,
            200,
            "Basket cleared successfully",
            basket
        );

    } catch (error) {

        next(error);
    }
};


module.exports = {

    getBasket,

    addItem,

    updateItemQuantity,

    removeItem,

    clearBasket
};