const swaggerJsdoc = require("swagger-jsdoc"); // Generates OpenAPI documentation.

// Swagger/OpenAPI configuration.
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",

        info: {
            title: "Cake Delight - Catalog Service API",
            version: "1.0.0",
            description:
                "REST API for managing the Cake Delight cake catalog."
        },

        servers: [
            {
                url: "http://localhost:5001",
                description: "Local Development Server"
            }
        ],

        tags: [
            {
                name: "Catalog",
                description: "Cake catalog management APIs"
            }
        ],

        components: {
            schemas: {

                CakeInput: {
                    type: "object",

                    required: [
                        "name",
                        "description",
                        "category",
                        "price",
                        "stock"
                    ],

                    properties: {
                        name: {
                            type: "string",
                            example: "Chocolate Truffle Cake"
                        },

                        description: {
                            type: "string",
                            example:
                                "Rich chocolate cake with chocolate ganache"
                        },

                        category: {
                            type: "string",
                            example: "Birthday"
                        },

                        price: {
                            type: "number",
                            example: 850
                        },

                        stock: {
                            type: "integer",
                            example: 20
                        },

                        imageUrl: {
                            type: "string",
                            example:
                                "https://example.com/cake.jpg"
                        },

                        isAvailable: {
                            type: "boolean",
                            example: true
                        }
                    }
                },

                Cake: {
                    allOf: [
                        {
                            $ref: "#/components/schemas/CakeInput"
                        },

                        {
                            type: "object",

                            properties: {
                                _id: {
                                    type: "string",
                                    example:
                                        "507f1f77bcf86cd799439011"
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
                        }
                    ]
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
                            example: "Cake not found"
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

// Generates the Swagger specification.
const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = swaggerSpec;