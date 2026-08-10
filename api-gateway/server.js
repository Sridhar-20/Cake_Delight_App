require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const gatewayRoutes =
    require("./src/routes/gatewayRoutes");

const app = express();


// ==========================================================
// MIDDLEWARE
// ==========================================================

app.use(cors());


// ==========================================================
// FRONTEND
// ==========================================================

app.use(
    express.static(
        path.join(__dirname, "public")
    )
);


// ==========================================================
// HEALTH CHECK
// ==========================================================

app.get("/health", (req, res) => {

    res.status(200).json({

        success: true,

        message:
            "API Gateway is running"

    });

});


// ==========================================================
// API GATEWAY ROUTES
// ==========================================================

// IMPORTANT:
//
// Gateway routes MUST be registered before
// express.json() so that the proxy receives
// the original request body.

app.use(
    "/api",
    gatewayRoutes
);


// ==========================================================
// BODY PARSING
// ==========================================================

app.use(
    express.json()
);

app.use(
    express.urlencoded({
        extended: true
    })
);


// ==========================================================
// FRONTEND FALLBACK
// ==========================================================

app.get("/", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "../public/index.html"
        )
    );

});


// ==========================================================
// 404 HANDLER
// ==========================================================

app.use((req, res) => {

    res.status(404).json({

        success: false,

        message:
            `Gateway route not found: ${req.method} ${req.originalUrl}`

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
        `Cake Delight App: http://localhost:${PORT}`
    );

});