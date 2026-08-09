/**
 * ==========================================================
 * Cake Delight
 * Catalog Microservice
 * ----------------------------------------------------------
 * Database Configuration
 *
 * This module is responsible for establishing and managing
 * the connection between the Catalog Service and MongoDB.
 *
 * Author : Bhukya Sridhar
 * ==========================================================
 */

const mongoose = require("mongoose");

/**
 * Connects the Catalog Service to MongoDB.
 *
 * @returns {Promise<void>} Resolves when the connection is successful.
 * @throws {Error} Throws an error if the connection fails.
 */
const connectDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log("✅ Catalog Database connected successfully");
    } catch (error) {
        console.error("❌ Catalog Database connection failed");
        console.error(`Error: ${error.message}`);

        process.exit(1);
    }
};

module.exports = connectDatabase;