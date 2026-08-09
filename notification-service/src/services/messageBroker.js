const amqp = require("amqplib");

const RABBITMQ_URL =
    process.env.RABBITMQ_URL || "amqp://localhost:5672";

const EVENT_EXCHANGE =
    process.env.EVENT_EXCHANGE || "cake_delight_events";

const NOTIFICATION_QUEUE =
    process.env.NOTIFICATION_QUEUE || "notification_service_queue";

let connection = null;
let channel = null;
let reconnectTimer = null;

const connectAndConsume = async (handleEvent) => {
    try {
        connection = await amqp.connect(RABBITMQ_URL);

        connection.on("close", () => {
            connection = null;
            channel = null;

            console.warn(
                "RabbitMQ connection closed. Retrying..."
            );

            scheduleReconnect(handleEvent);
        });

        connection.on("error", (error) => {
            console.error(
                `RabbitMQ connection error: ${error.message}`
            );
        });

        channel = await connection.createChannel();

        await channel.assertExchange(
            EVENT_EXCHANGE,
            "topic",
            { durable: true }
        );

        await channel.assertQueue(
            NOTIFICATION_QUEUE,
            { durable: true }
        );

        await channel.bindQueue(
            NOTIFICATION_QUEUE,
            EVENT_EXCHANGE,
            "order.#"
        );

        await channel.prefetch(10);

        console.log(
            `RabbitMQ consumer connected: ${RABBITMQ_URL}`
        );

        console.log(
            `Listening on queue: ${NOTIFICATION_QUEUE}`
        );

        await channel.consume(
            NOTIFICATION_QUEUE,
            async (message) => {

                if (!message) {
                    return;
                }

                try {

                    const event =
                        JSON.parse(
                            message.content.toString()
                        );

                    await handleEvent(event);

                    channel.ack(message);

                } catch (error) {

                    console.error(
                        `Failed to process event: ${error.message}`
                    );

                    // Requeue transient processing failures.
                    channel.nack(
                        message,
                        false,
                        true
                    );
                }
            }
        );

    } catch (error) {

        console.error(
            `RabbitMQ connection failed: ${error.message}`
        );

        connection = null;
        channel = null;

        scheduleReconnect(handleEvent);
    }
};

const scheduleReconnect = (handleEvent) => {

    if (reconnectTimer) {
        return;
    }

    reconnectTimer = setTimeout(
        () => {
            reconnectTimer = null;
            connectAndConsume(handleEvent);
        },
        5000
    );
};

const closeBroker = async () => {

    if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
    }

    try {

        if (channel) {
            await channel.close();
        }

        if (connection) {
            await connection.close();
        }

    } catch (error) {

        console.error(
            `Failed to close RabbitMQ connection: ${error.message}`
        );

    } finally {

        channel = null;
        connection = null;

    }
};

module.exports = {
    connectAndConsume,
    closeBroker
};
