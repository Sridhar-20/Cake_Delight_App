const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
    {
        cakeId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Cake"
        },

        customerEmail: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },

        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },

        review: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 500
        }
    },

    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Rating",
    ratingSchema
);