const path = require("path");
const swaggerJsdoc =
    require("swagger-jsdoc");

const swaggerUi =
    require("swagger-ui-express");


const options = {

    definition: {

        openapi: "3.0.0",

        info: {

            title:
                "Cake Delight - Rating Service API",

            version:
                "1.0.0",

            description:
                "REST API for managing customer ratings and reviews for cakes in the Cake Delight application."

        },


        servers: [

            {

                url:
                    "http://localhost:5004",

                description:
                    "Local Rating Service"

            }

        ],


        tags: [

            {

                name:
                    "Ratings",

                description:
                    "Cake rating and review management APIs"

            }

        ],


        components: {

            schemas: {

                RatingInput: {

                    type: "object",

                    required: [

                        "cakeId",
                        "customerEmail",
                        "rating",
                        "review"

                    ],

                    properties: {

                        cakeId: {

                            type: "string",

                            description:
                                "MongoDB ID of the cake",

                            example:
                                "66a76b86dc51dbe305cae2e33"

                        },


                        customerEmail: {

                            type: "string",

                            format: "email",

                            description:
                                "Email address of the customer",

                            example:
                                "sridhar@gmail.com"

                        },


                        rating: {

                            type: "integer",

                            minimum: 1,

                            maximum: 5,

                            description:
                                "Cake rating from 1 to 5",

                            example: 5

                        },


                        review: {

                            type: "string",

                            minLength: 3,

                            maxLength: 500,

                            description:
                                "Customer review",

                            example:
                                "The cake was delicious and fresh."

                        }

                    }

                },


                UpdateRatingInput: {

                    type: "object",

                    properties: {

                        rating: {

                            type: "integer",

                            minimum: 1,

                            maximum: 5,

                            example: 4

                        },


                        review: {

                            type: "string",

                            minLength: 3,

                            maxLength: 500,

                            example:
                                "Very good cake."

                        }

                    }

                },


                Rating: {

                    type: "object",

                    properties: {

                        _id: {

                            type: "string",

                            example:
                                "66a78312cb19b7e0598b590d1"

                        },


                        cakeId: {

                            type: "string",

                            example:
                                "66a76b86dc51dbe305cae2e33"

                        },


                        customerEmail: {

                            type: "string",

                            format: "email",

                            example:
                                "sridhar@gmail.com"

                        },


                        rating: {

                            type: "integer",

                            minimum: 1,

                            maximum: 5,

                            example: 5

                        },


                        review: {

                            type: "string",

                            example:
                                "The cake was delicious and fresh."

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
                                "Rating retrieved successfully"

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
                                "Rating not found"

                        }

                    }

                }

            }

        }

    },


    apis: [
        path
            .resolve(__dirname, "../routes/ratingRoutes.js")
            .replace(/\\/g, "/")
    ]

};


const swaggerSpec =
    swaggerJsdoc(options);

console.log(
    "Swagger paths:",
    Object.keys(swaggerSpec.paths || {})
);

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


module.exports =
    setupSwagger;