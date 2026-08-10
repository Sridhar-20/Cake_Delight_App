require("dotenv").config();

const express = require("express");
const cors = require("cors");

const gatewayRoutes =
    require("./src/routes/gatewayRoutes");

const app = express();


// ==========================================================
// MIDDLEWARE
// ==========================================================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));


// ==========================================================
// HEALTH CHECK
// ==========================================================

app.get("/health", (req, res) => {

    res.status(200).json({
        success: true,
        message: "API Gateway is running"
    });

});


// ==========================================================
// API GATEWAY ROUTES
// ==========================================================

app.use(
    "/api",
    gatewayRoutes
);


// ==========================================================
// 404 HANDLER
// ==========================================================

app.use((req, res) => {

    res.status(404).json({
        success: false,
        message: `Gateway route not found: ${req.method} ${req.originalUrl}`
    });

});


// ==========================================================
// SERVER
// ==========================================================

const PORT =
    process.env.PORT || 5000;


app.listen(PORT, () => {

    console.log(
        `API Gateway running on port ${PORT}`
    );

    console.log(
        `Gateway URL: http://localhost:${PORT}`
    );

});