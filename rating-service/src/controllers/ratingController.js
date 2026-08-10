const ratingService =
    require("../services/ratingService");


// ==========================================================
// CREATE RATING
// ==========================================================

const createRating = async (req, res, next) => {

    try {

        const rating =
            await ratingService.createRating(
                req.body
            );


        res.status(201).json({

            success: true,

            message:
                "Rating created successfully",

            data: rating

        });

    } catch (error) {

        next(error);

    }
};


// ==========================================================
// GET ALL RATINGS
// ==========================================================

const getAllRatings = async (req, res, next) => {

    try {

        const ratings =
            await ratingService.getAllRatings();


        res.status(200).json({

            success: true,

            message:
                "Ratings retrieved successfully",

            data: ratings

        });

    } catch (error) {

        next(error);

    }
};


// ==========================================================
// GET RATING BY ID
// ==========================================================

const getRatingById = async (req, res, next) => {

    try {

        const rating =
            await ratingService.getRatingById(
                req.params.id
            );


        res.status(200).json({

            success: true,

            message:
                "Rating retrieved successfully",

            data: rating

        });

    } catch (error) {

        next(error);

    }
};


// ==========================================================
// GET RATINGS BY CAKE
// ==========================================================

const getRatingsByCake = async (req, res, next) => {

    try {

        const ratings =
            await ratingService.getRatingsByCake(
                req.params.cakeId
            );


        res.status(200).json({

            success: true,

            message:
                "Cake ratings retrieved successfully",

            data: ratings

        });

    } catch (error) {

        next(error);

    }
};


// ==========================================================
// UPDATE RATING
// ==========================================================

const updateRating = async (req, res, next) => {

    try {

        const rating =
            await ratingService.updateRating(
                req.params.id,
                req.body
            );


        res.status(200).json({

            success: true,

            message:
                "Rating updated successfully",

            data: rating

        });

    } catch (error) {

        next(error);

    }
};


// ==========================================================
// DELETE RATING
// ==========================================================

const deleteRating = async (req, res, next) => {

    try {

        const rating =
            await ratingService.deleteRating(
                req.params.id
            );


        res.status(200).json({

            success: true,

            message:
                "Rating deleted successfully",

            data: rating

        });

    } catch (error) {

        next(error);

    }
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