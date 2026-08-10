const services = {
    catalog: process.env.CATALOG_SERVICE_URL,
    order: process.env.ORDER_SERVICE_URL,
    notification: process.env.NOTIFICATION_SERVICE_URL,
    rating: process.env.RATING_SERVICE_URL
};

module.exports = services;