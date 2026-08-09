const mongoose = require("mongoose"); // MongoDB object modeling library.

// Defines the structure and validation rules for cake documents.
const cakeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Cake name is required"],
            trim: true,
            minlength: [2, "Cake name must contain at least 2 characters"],
            maxlength: [100, "Cake name cannot exceed 100 characters"]
        },

        description: {
            type: String,
            required: [true, "Cake description is required"],
            trim: true,
            maxlength: [500, "Cake description cannot exceed 500 characters"]
        },

        category: {
            type: String,
            required: [true, "Cake category is required"],
            trim: true
        },

        price: {
            type: Number,
            required: [true, "Cake price is required"],
            min: [1, "Cake price must be greater than 0"]
        },

        stock: {
            type: Number,
            required: [true, "Cake stock is required"],
            min: [0, "Stock cannot be negative"],
            default: 0
        },

        imageUrl: {
            type: String,
            trim: true,
            default: ""
        },

        isAvailable: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt.
        collection: "cakes" // Uses the cakes collection in MongoDB.
    }
);

const Cake = mongoose.model("Cake", cakeSchema); // Creates the Cake model.

module.exports = Cake; // Exports the Cake model.