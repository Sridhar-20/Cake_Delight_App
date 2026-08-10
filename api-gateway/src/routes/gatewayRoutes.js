const express = require("express");

const {
    createProxyMiddleware
} = require("http-proxy-middleware");

const services = require("../config/services");

const router = express.Router();


// ==========================================================
// CATALOG SERVICE
// Gateway:
//     /api/catalog/*
//
// Target:
//     http://localhost:5001/api/catalog/*
// ==========================================================

router.use(
    "/catalog",

    createProxyMiddleware({

        target: services.catalog,

        changeOrigin: true

    })
);


// ==========================================================
// ORDER SERVICE
// Gateway:
//     /api/orders/*
//
// Target:
//     http://localhost:5002/api/orders/*
// ==========================================================

router.use(
    "/orders",

    createProxyMiddleware({

        target: services.order,

        changeOrigin: true

    })
);


// ==========================================================
// RATING SERVICE
// Gateway:
//     /api/ratings/*
//
// Target:
//     http://localhost:5004/api/ratings/*
// ==========================================================

router.use(
    "/ratings",

    createProxyMiddleware({

        target: services.rating,

        changeOrigin: true

    })
);


// ==========================================================
// NOTIFICATION SERVICE
// Gateway:
//     /api/notifications/*
//
// Target:
//     http://localhost:5003/api/notifications/*
// ==========================================================

router.use(
    "/notifications",

    createProxyMiddleware({

        target: services.notification,

        changeOrigin: true

    })
);


module.exports = router;