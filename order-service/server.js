require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/database");

const PORT = process.env.PORT || 5002;


const startServer = async () => {

    try {

        await connectDB();

        app.listen(PORT, () => {

            console.log(
                `Order Service running on port ${PORT}`
            );

            console.log(
                `Order UI: http://localhost:${PORT}`
            );

            console.log(
                `Swagger: http://localhost:${PORT}/api-docs`
            );

        });

    } catch (error) {

        console.error(
            `Failed to start server: ${error.message}`
        );

        process.exit(1);
    }
};


startServer();