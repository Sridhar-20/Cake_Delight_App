const Basket = require("../models/Basket");

const {
    getCakeById
} = require("./catalogService");


// ==========================================================
// RECALCULATE BASKET TOTAL
// ==========================================================

const calculateTotal = (items) => {

    return items.reduce(
        (total, item) =>
            total + item.subtotal,
        0
    );
};


// ==========================================================
// GET OR CREATE BASKET
// ==========================================================

const getOrCreateBasket = async (
    customerEmail
) => {

    let basket =
        await Basket.findOne({
            customerEmail
        });


    if (!basket) {

        basket =
            await Basket.create({
                customerEmail,
                items: [],
                totalAmount: 0
            });
    }


    return basket;
};


// ==========================================================
// GET BASKET
// ==========================================================

const getBasket = async (
    customerEmail
) => {

    return await getOrCreateBasket(
        customerEmail
    );
};


// ==========================================================
// ADD ITEM TO BASKET
// ==========================================================

const addItem = async (
    customerEmail,
    cakeId,
    quantity
) => {

    // ------------------------------------------------------
    // Get current cake information from Catalog Service.
    // ------------------------------------------------------

    const cake =
        await getCakeById(cakeId);


    if (!cake) {

        const error =
            new Error(
                `Cake not found: ${cakeId}`
            );

        error.statusCode = 404;

        throw error;
    }


    if (!cake.isAvailable) {

        const error =
            new Error(
                `Cake is currently unavailable: ${cake.name}`
            );

        error.statusCode = 400;

        throw error;
    }


    const basket =
        await getOrCreateBasket(
            customerEmail
        );


    const existingItem =
        basket.items.find(
            item =>
                item.cakeId.toString() ===
                cakeId.toString()
        );


    const existingQuantity =
        existingItem
            ? existingItem.quantity
            : 0;


    const newQuantity =
        existingQuantity + quantity;


    // ------------------------------------------------------
    // Check stock.
    // ------------------------------------------------------

    if (cake.stock < newQuantity) {

        const error =
            new Error(
                `Insufficient stock for cake: ${cake.name}`
            );

        error.statusCode = 400;

        throw error;
    }


    // ------------------------------------------------------
    // Update existing item.
    // ------------------------------------------------------

    if (existingItem) {

        existingItem.quantity =
            newQuantity;

        existingItem.price =
            cake.price;

        existingItem.cakeName =
            cake.name;

        existingItem.subtotal =
            cake.price * newQuantity;

    }

    // ------------------------------------------------------
    // Add new item.
    // ------------------------------------------------------

    else {

        basket.items.push({

            cakeId: cake._id,

            cakeName: cake.name,

            price: cake.price,

            quantity,

            subtotal:
                cake.price * quantity
        });
    }


    // ------------------------------------------------------
    // Recalculate total.
    // ------------------------------------------------------

    basket.totalAmount =
        calculateTotal(
            basket.items
        );


    await basket.save();


    return basket;
};


// ==========================================================
// UPDATE ITEM QUANTITY
// ==========================================================

const updateItemQuantity = async (
    customerEmail,
    cakeId,
    quantity
) => {

    const basket =
        await Basket.findOne({
            customerEmail
        });


    if (!basket) {
        return null;
    }


    const item =
        basket.items.find(
            item =>
                item.cakeId.toString() ===
                cakeId.toString()
        );


    if (!item) {
        return null;
    }


    // ------------------------------------------------------
    // Get latest cake information.
    // ------------------------------------------------------

    const cake =
        await getCakeById(cakeId);


    if (!cake) {

        const error =
            new Error(
                `Cake not found: ${cakeId}`
            );

        error.statusCode = 404;

        throw error;
    }


    if (!cake.isAvailable) {

        const error =
            new Error(
                `Cake is currently unavailable: ${cake.name}`
            );

        error.statusCode = 400;

        throw error;
    }


    if (cake.stock < quantity) {

        const error =
            new Error(
                `Insufficient stock for cake: ${cake.name}`
            );

        error.statusCode = 400;

        throw error;
    }


    item.quantity =
        quantity;

    item.cakeName =
        cake.name;

    item.price =
        cake.price;

    item.subtotal =
        cake.price * quantity;


    basket.totalAmount =
        calculateTotal(
            basket.items
        );


    await basket.save();


    return basket;
};


// ==========================================================
// REMOVE ITEM
// ==========================================================

const removeItem = async (
    customerEmail,
    cakeId
) => {

    const basket =
        await Basket.findOne({
            customerEmail
        });


    if (!basket) {
        return null;
    }


    const originalLength =
        basket.items.length;


    basket.items =
        basket.items.filter(
            item =>
                item.cakeId.toString() !==
                cakeId.toString()
        );


    if (
        basket.items.length ===
        originalLength
    ) {
        return null;
    }


    basket.totalAmount =
        calculateTotal(
            basket.items
        );


    await basket.save();


    return basket;
};


// ==========================================================
// CLEAR BASKET
// ==========================================================

const clearBasket = async (
    customerEmail
) => {

    const basket =
        await Basket.findOne({
            customerEmail
        });


    if (!basket) {
        return null;
    }


    basket.items = [];

    basket.totalAmount = 0;


    await basket.save();


    return basket;
};


module.exports = {

    getBasket,

    addItem,

    updateItemQuantity,

    removeItem,

    clearBasket
};