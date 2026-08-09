const mongoose = require("mongoose");

// ==========================================================
// BASKET ITEM SCHEMA
// ==========================================================

const basketItemSchema = new mongoose.Schema(
    {
        cakeId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },

        cakeName: {
            type: String,
            required: true,
            trim: true
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        quantity: {
            type: Number,
            required: true,
            min: 1
        },

        subtotal: {
            type: Number,
            required: true,
            min: 0
        }
    },
    {
        _id: false
    }
);


// ==========================================================
// BASKET SCHEMA
// ==========================================================

const basketSchema = new mongoose.Schema(
    {
        customerEmail: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            unique: true
        },

        items: {
            type: [basketItemSchema],
            default: []
        },

        totalAmount: {
            type: Number,
            default: 0,
            min: 0
        }
    },
    {
        timestamps: true
    }
);


module.exports =
    mongoose.model("Basket", basketSchema);