require("dotenv").config();

const app = require("./src/app");

const connectDB =
    require("./src/config/database");


const PORT =
    process.env.PORT || 5004;


// ==========================================================
// START SERVER
// ==========================================================

const startServer = async () => {

    try {

        await connectDB();


        app.listen(
            PORT,
            () => {

                console.log(
                    `Rating Service running on port ${PORT}`
                );

                console.log(
                    `Rating UI: http://localhost:${PORT}`
                );

            }
        );

    } catch (error) {

        console.error(
            "Failed to start Rating Service:",
            error.message
        );

        process.exit(1);
    }
};


startServer();