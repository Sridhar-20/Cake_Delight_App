const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
    definition: {
        openapi: "3.0.0",

        info: {
            title: "Cake Delight - Order Service API",
            version: "1.0.0",
            description:
                "REST API for managing Cake Delight customer orders, order status, cake stock validation, stock reduction, and order cancellation."
        },

        servers: [
            {
                url: "http://localhost:5002",
                description: "Local Order Service"
            }
        ],

        tags: [
            {
                name: "Orders",
                description: "Order management APIs"
            }
        ],

        components: {

            schemas: {

                OrderItemInput: {
                    type: "object",

                    required: [
                        "cakeId",
                        "quantity"
                    ],

                    properties: {

                        cakeId: {
                            type: "string",
                            description:
                                "MongoDB ID of the cake",
                            example:
                                "6a76b86dc51dbe305cae2e33"
                        },

                        quantity: {
                            type: "integer",
                            minimum: 1,
                            description:
                                "Number of cakes to order",
                            example: 2
                        }

                    }
                },


                OrderInput: {
                    type: "object",

                    required: [
                        "customerName",
                        "customerEmail",
                        "customerPhone",
                        "items",
                        "deliveryAddress",
                        "paymentMethod"
                    ],

                    properties: {

                        customerName: {
                            type: "string",
                            example: "Sridhar"
                        },

                        customerEmail: {
                            type: "string",
                            format: "email",
                            example:
                                "sridhar@gmail.com"
                        },

                        customerPhone: {
                            type: "string",
                            example:
                                "9876543210"
                        },

                        items: {
                            type: "array",

                            minItems: 1,

                            items: {
                                $ref:
                                    "#/components/schemas/OrderItemInput"
                            }
                        },

                        deliveryAddress: {
                            type: "string",
                            example:
                                "Hyderabad"
                        },

                        paymentMethod: {
                            type: "string",
                            enum: [
                                "COD",
                                "ONLINE"
                            ],
                            example:
                                "COD"
                        }

                    }
                },


                OrderItem: {
                    type: "object",

                    properties: {

                        cakeId: {
                            type: "string",
                            example:
                                "6a76b86dc51dbe305cae2e33"
                        },

                        cakeName: {
                            type: "string",
                            example:
                                "Fresh Strawberry Cake"
                        },

                        price: {
                            type: "number",
                            example: 700
                        },

                        quantity: {
                            type: "integer",
                            example: 2
                        },

                        subtotal: {
                            type: "number",
                            example: 1400
                        }

                    }
                },


                Order: {
                    type: "object",

                    properties: {

                        _id: {
                            type: "string",
                            example:
                                "6a773cbcf0240e24a91ee059"
                        },

                        customerName: {
                            type: "string",
                            example:
                                "Sridhar"
                        },

                        customerEmail: {
                            type: "string",
                            example:
                                "sridhar@gmail.com"
                        },

                        customerPhone: {
                            type: "string",
                            example:
                                "9876543210"
                        },

                        items: {
                            type: "array",

                            items: {
                                $ref:
                                    "#/components/schemas/OrderItem"
                            }
                        },

                        totalAmount: {
                            type: "number",
                            example: 1400
                        },

                        deliveryAddress: {
                            type: "string",
                            example:
                                "Hyderabad"
                        },

                        paymentMethod: {
                            type: "string",
                            example:
                                "COD"
                        },

                        status: {
                            type: "string",

                            enum: [
                                "PLACED",
                                "CONFIRMED",
                                "PREPARING",
                                "OUT_FOR_DELIVERY",
                                "DELIVERED",
                                "CANCELLED"
                            ],

                            example:
                                "PLACED"
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


                UpdateOrderStatusInput: {
                    type: "object",

                    required: [
                        "status"
                    ],

                    properties: {

                        status: {
                            type: "string",

                            enum: [
                                "CONFIRMED",
                                "PREPARING",
                                "OUT_FOR_DELIVERY",
                                "DELIVERED"
                            ],

                            example:
                                "CONFIRMED"
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
                            example:
                                "Order retrieved successfully"
                        },

                        data: {
                            type: "object"
                        }

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
                            example:
                                "Order not found"
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


const swaggerSpec =
    swaggerJsdoc(options);


const setupSwagger = (app) => {

    app.use(
        "/api-docs",
        swaggerUi.serve,
        swaggerUi.setup(
            swaggerSpec,
            {
                explorer: true
            }
        )
    );

};


module.exports = setupSwagger;