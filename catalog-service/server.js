require("dotenv").config(); // Loads environment variables.

const app = require("./src/app"); // Express application.
const connectDatabase = require("./src/config/database"); // MongoDB connection.

const PORT = process.env.PORT || 5001; // Catalog Service port.

const startServer = async () => { // Connects to the database and starts the server.
    try {

        await connectDatabase();

        app.listen(PORT, () => {
            console.log(
                `🚀 Catalog Service is running on port ${PORT}`
            );
        });

    } catch (error) {

        console.error("❌ Failed to start Catalog Service");
        console.error(`Error: ${error.message}`);

        process.exit(1);
    }
};

startServer(); // Starts the application.