const express = require("express");
const path = require("path");

const ratingRoutes =
    require("./routes/ratingRoutes");


const notFoundMiddleware =
    require("./middleware/notFoundMiddleware");

const errorMiddleware =
    require("./middleware/errorMiddleware");

const setupSwagger =
    require("./docs/swagger");

const app = express();

// ==========================================================
// MIDDLEWARE
// ==========================================================

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));


// ==========================================================
// STATIC UI
// ==========================================================

app.use(
    express.static(
        path.join(__dirname, "../public")
    )
);

// ==========================================================
// RATING ROUTES
// ==========================================================

app.use(
    "/api/ratings",
    ratingRoutes
);

// ==========================================================
// SWAGGER
// ==========================================================

setupSwagger(app);

// ==========================================================
// HEALTH CHECK
// ==========================================================

app.get(
    "/health",
    (req, res) => {

        res.status(200).json({

            success: true,

            message:
                "Rating Service is running"

        });

    }
);


// ==========================================================
// ROOT
// ==========================================================

app.get(
    "/",
    (req, res) => {

        res.sendFile(
            path.join(
                __dirname,
                "../public/index.html"
            )
        );

    }
);

// ==========================================================
// NOT FOUND MIDDLEWARE
// ==========================================================

app.use(
    notFoundMiddleware
);


// ==========================================================
// ERROR MIDDLEWARE
// ==========================================================

app.use(
    errorMiddleware
);

module.exports = app;