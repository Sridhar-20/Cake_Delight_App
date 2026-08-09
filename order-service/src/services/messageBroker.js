const amqp = require("amqplib");
const { randomUUID } = require("crypto");

const RABBITMQ_URL =
    process.env.RABBITMQ_URL || "amqp://localhost:5672";

const EVENT_EXCHANGE =
    process.env.EVENT_EXCHANGE || "cake_delight_events";

let connection = null;
let channel = null;
let connectionPromise = null;

const getChannel = async () => {
    if (channel) {
        return channel;
    }

    if (!connectionPromise) {
        connectionPromise = amqp.connect(RABBITMQ_URL)
            .then((newConnection) => {
                connection = newConnection;

                connection.on("close", () => {
                    connection = null;
                    channel = null;
                    connectionPromise = null;
                    console.warn("RabbitMQ connection closed.");
                });

                connection.on("error", (error) => {
                    console.error(
                        `RabbitMQ connection error: ${error.message}`
                    );
                });

                return newConnection.createChannel();
            })
            .then(async (newChannel) => {
                channel = newChannel;

                await channel.assertExchange(
                    EVENT_EXCHANGE,
                    "topic",
                    { durable: true }
                );

                console.log(
                    `RabbitMQ connected: ${RABBITMQ_URL}`
                );

                return channel;
            })
            .catch((error) => {
                connectionPromise = null;

                throw error;
            });
    }

    return connectionPromise;
};

const publishEvent = async (eventType, payload) => {
    try {
        const event = {
            eventId: randomUUID(),
            eventType,
            occurredAt: new Date().toISOString(),
            payload
        };

        const currentChannel = await getChannel();

        const routingKey = eventType
            .toLowerCase()
            .replaceAll("_", ".");

        currentChannel.publish(
            EVENT_EXCHANGE,
            routingKey,
            Buffer.from(JSON.stringify(event)),
            {
                persistent: true,
                contentType: "application/json"
            }
        );

        console.log(
            `Published event: ${eventType} (${event.eventId})`
        );

        return event;
    } catch (error) {
        console.error(
            `Unable to publish ${eventType} event: ${error.message}`
        );

        // The order itself has already been created. Do not fail the
        // customer request just because the broker is temporarily unavailable.
        return null;
    }
};

const closeBroker = async () => {
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
        connectionPromise = null;
    }
};

module.exports = {
    publishEvent,
    closeBroker
};
