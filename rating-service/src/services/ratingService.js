const Rating = require("../models/Rating");


// ==========================================================
// CREATE RATING
// ==========================================================

const createRating = async (ratingData) => {

    const {
        cakeId,
        customerEmail,
        rating,
        review
    } = ratingData;


    const existingRating =
        await Rating.findOne({
            cakeId,
            customerEmail
        });


    if (existingRating) {

        const error =
            new Error(
                "Customer has already rated this cake"
            );

        error.statusCode = 400;

        throw error;
    }


    const newRating =
        await Rating.create({
            cakeId,
            customerEmail,
            rating,
            review
        });


    return newRating;
};


// ==========================================================
// GET ALL RATINGS
// ==========================================================

const getAllRatings = async () => {

    return await Rating.find()
        .sort({
            createdAt: -1
        });
};


// ==========================================================
// GET RATING BY ID
// ==========================================================

const getRatingById = async (ratingId) => {

    const rating =
        await Rating.findById(ratingId);


    if (!rating) {

        const error =
            new Error(
                "Rating not found"
            );

        error.statusCode = 404;

        throw error;
    }


    return rating;
};


// ==========================================================
// GET RATINGS BY CAKE
// ==========================================================

const getRatingsByCake = async (cakeId) => {

    return await Rating.find({
        cakeId
    }).sort({
        createdAt: -1
    });
};


// ==========================================================
// UPDATE RATING
// ==========================================================

const updateRating = async (
    ratingId,
    ratingData
) => {

    const {
        rating,
        review
    } = ratingData;


    const existingRating =
        await Rating.findById(ratingId);


    if (!existingRating) {

        const error =
            new Error(
                "Rating not found"
            );

        error.statusCode = 404;

        throw error;
    }


    if (
        rating !== undefined
    ) {

        existingRating.rating =
            rating;
    }


    if (
        review !== undefined
    ) {

        existingRating.review =
            review;
    }


    await existingRating.save();


    return existingRating;
};


// ==========================================================
// DELETE RATING
// ==========================================================

const deleteRating = async (
    ratingId
) => {

    const existingRating =
        await Rating.findById(ratingId);


    if (!existingRating) {

        const error =
            new Error(
                "Rating not found"
            );

        error.statusCode = 404;

        throw error;
    }


    await Rating.findByIdAndDelete(
        ratingId
    );


    return existingRating;
};


// ==========================================================
// EXPORTS
// ==========================================================

module.exports = {

    createRating,

    getAllRatings,

    getRatingById,

    getRatingsByCake,

    updateRating,

    deleteRating

};