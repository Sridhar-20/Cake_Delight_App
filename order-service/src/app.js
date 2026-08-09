const express = require("express");
const cors = require("cors");
const path = require("path");

const orderRoutes = require("./routes/orderRoutes");
const basketRoutes =
    require("./routes/basketRoutes");

const notFoundMiddleware = require("./middleware/notFoundMiddleware");
const errorMiddleware = require("./middleware/errorMiddleware");

const setupSwagger = require("./docs/swagger");

const app = express();


// ==========================================================
// MIDDLEWARE
// ==========================================================

app.use(cors());

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);


// ==========================================================
// SERVE ORDER SERVICE UI
// ==========================================================

app.use(
    express.static(
        path.join(__dirname, "..", "public")
    )
);


// ==========================================================
// ROOT / ORDER SERVICE UI
// ==========================================================

app.get("/", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "..",
            "public",
            "index.html"
        )
    );

});


// ==========================================================
// HEALTH CHECK
// ==========================================================

app.get("/health", (req, res) => {

    return res.status(200).json({
        success: true,
        service: "Order Service",
        status: "Running"
    });

});


// ==========================================================
// ORDER ROUTES
// ==========================================================

app.use(
    "/api/orders",
    orderRoutes
);


// ==========================================================
// BASKET ROUTES
// ==========================================================
app.use(
    "/api/orders/basket",
    basketRoutes
);


// ==========================================================
// SWAGGER
// ==========================================================

setupSwagger(app);


// ==========================================================
// 404 MIDDLEWARE
// ==========================================================

app.use(notFoundMiddleware);


// ==========================================================
// ERROR MIDDLEWARE
// ==========================================================

app.use(errorMiddleware);


module.exports = app;