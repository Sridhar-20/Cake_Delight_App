const express = require("express");

const {
    getBasket,
    addItem,
    updateItemQuantity,
    removeItem,
    clearBasket
} = require("../controllers/basketController");


const router =
    express.Router();


// ==========================================================
// ADD ITEM TO BASKET
// ==========================================================

router.post(
    "/",
    addItem
);


// ==========================================================
// GET CUSTOMER BASKET
// ==========================================================

router.get(
    "/:customerEmail",
    getBasket
);


// ==========================================================
// UPDATE BASKET ITEM
// ==========================================================

router.patch(
    "/:customerEmail/:cakeId",
    updateItemQuantity
);


// ==========================================================
// REMOVE BASKET ITEM
// ==========================================================

router.delete(
    "/:customerEmail/:cakeId",
    removeItem
);


// ==========================================================
// CLEAR BASKET
// ==========================================================

router.delete(
    "/:customerEmail",
    clearBasket
);


module.exports = router;