require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/database");

const {
    createNotificationFromEvent
} = require("./src/services/notificationService");

const {
    connectAndConsume
} = require("./src/services/messageBroker");

const PORT = process.env.PORT || 5003;

const startServer = async () => {

    try {

        await connectDB();

        app.listen(PORT, () => {

            console.log(
                `Notification Service running on port ${PORT}`
            );

        });

        // Start the event consumer. If RabbitMQ is not running,
        // the consumer retries automatically every five seconds.
        connectAndConsume(
            createNotificationFromEvent
        );

    } catch (error) {

        console.error(
            `Failed to start Notification Service: ${error.message}`
        );

        process.exit(1);
    }
};

startServer();
