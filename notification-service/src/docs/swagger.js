const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
    definition: {
        openapi: "3.0.0",

        info: {
            title: "Cake Delight - Notification Service API",
            version: "1.0.0",
            description:
                "API documentation for the Cake Delight in-app Notification Service"
        },

        servers: [
            {
                url: "http://localhost:5003",
                description: "Local Notification Service"
            }
        ],

        tags: [
            {
                name: "Notifications",
                description: "In-app notification management APIs"
            }
        ],

        components: {
            schemas: {
                Notification: {
                    type: "object",
                    properties: {
                        _id: {
                            type: "string",
                            example: "6a78312cb19b7e0598b590d1"
                        },

                        orderId: {
                            type: "string",
                            example: "68a123456789abcdef123456"
                        },

                        customerEmail: {
                            type: "string",
                            format: "email",
                            example: "sridhar@gmail.com"
                        },

                        title: {
                            type: "string",
                            example: "Order Placed"
                        },

                        message: {
                            type: "string",
                            example:
                                "Your cake order has been placed successfully."
                        },

                        type: {
                            type: "string",
                            enum: [
                                "ORDER_PLACED",
                                "ORDER_CONFIRMED",
                                "ORDER_PREPARING",
                                "ORDER_OUT_FOR_DELIVERY",
                                "ORDER_DELIVERED",
                                "ORDER_CANCELLED"
                            ],
                            example: "ORDER_PLACED"
                        },

                        isRead: {
                            type: "boolean",
                            example: false
                        },

                        createdAt: {
                            type: "string",
                            format: "date-time"
                        },

                        updatedAt: {
                            type: "string",
                            format: "date-time"
                        }
                    }
                },

                CreateNotificationRequest: {
                    type: "object",
                    required: [
                        "orderId",
                        "customerEmail",
                        "title",
                        "message",
                        "type"
                    ],

                    properties: {
                        orderId: {
                            type: "string",
                            example: "68a123456789abcdef123456"
                        },

                        customerEmail: {
                            type: "string",
                            format: "email",
                            example: "sridhar@gmail.com"
                        },

                        title: {
                            type: "string",
                            example: "Order Placed"
                        },

                        message: {
                            type: "string",
                            example:
                                "Your cake order has been placed successfully."
                        },

                        type: {
                            type: "string",
                            enum: [
                                "ORDER_PLACED",
                                "ORDER_CONFIRMED",
                                "ORDER_PREPARING",
                                "ORDER_OUT_FOR_DELIVERY",
                                "ORDER_DELIVERED",
                                "ORDER_CANCELLED"
                            ],
                            example: "ORDER_PLACED"
                        }
                    }
                },

                UpdateNotificationRequest: {
                    type: "object",
                    required: ["isRead"],

                    properties: {
                        isRead: {
                            type: "boolean",
                            example: true
                        }
                    }
                },

                SuccessResponse: {
                    type: "object",
                    properties: {
                        success: {
                            type: "boolean",
                            example: true
                        },

                        message: {
                            type: "string",
                            example: "Operation successful"
                        },

                        data: {}
                    }
                },

                ErrorResponse: {
                    type: "object",
                    properties: {
                        success: {
                            type: "boolean",
                            example: false
                        },

                        message: {
                            type: "string",
                            example: "Notification not found"
                        }
                    }
                }
            }
        }
    },

    apis: [
        "./src/routes/*.js"
    ]
};

const swaggerSpec = swaggerJsdoc(options);

const setupSwagger = (app) => {
    app.use(
        "/api-docs",
        swaggerUi.serve,
        swaggerUi.setup(swaggerSpec)
    );
};

module.exports = setupSwagger;