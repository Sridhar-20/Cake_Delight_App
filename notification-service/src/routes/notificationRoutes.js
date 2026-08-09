const express = require("express");

const {
    createNotification,
    getAllNotifications,
    getNotificationById,
    getNotificationsByCustomer,
    markNotificationAsRead,
    deleteNotification
} = require("../controllers/notificationController");

const router = express.Router();


/**
 * @swagger
 * /api/notifications:
 *   post:
 *     summary: Create a notification
 *     description: Creates a new in-app notification.
 *     tags:
 *       - Notifications
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateNotificationRequest'
 *     responses:
 *       201:
 *         description: Notification created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Validation failed
 *       500:
 *         description: Internal server error
 */
router.post(
    "/",
    createNotification
);


/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Get all notifications
 *     description: Retrieves all notifications.
 *     tags:
 *       - Notifications
 *     responses:
 *       200:
 *         description: Notifications retrieved successfully
 *       500:
 *         description: Internal server error
 */
router.get(
    "/",
    getAllNotifications
);


/**
 * @swagger
 * /api/notifications/customer/{email}:
 *   get:
 *     summary: Get notifications for a customer
 *     description: Retrieves notifications belonging to a specific customer email.
 *     tags:
 *       - Notifications
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         example: sridhar@gmail.com
 *     responses:
 *       200:
 *         description: Customer notifications retrieved successfully
 *       500:
 *         description: Internal server error
 */
router.get(
    "/customer/:email",
    getNotificationsByCustomer
);


/**
 * @swagger
 * /api/notifications/{id}:
 *   get:
 *     summary: Get notification by ID
 *     description: Retrieves a single notification using its ID.
 *     tags:
 *       - Notifications
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 6a78312cb19b7e0598b590d1
 *     responses:
 *       200:
 *         description: Notification retrieved successfully
 *       400:
 *         description: Invalid notification ID
 *       404:
 *         description: Notification not found
 */
router.get(
    "/:id",
    getNotificationById
);


/**
 * @swagger
 * /api/notifications/{id}/read:
 *   patch:
 *     summary: Mark notification as read
 *     description: Marks an existing notification as read.
 *     tags:
 *       - Notifications
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 6a78312cb19b7e0598b590d1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateNotificationRequest'
 *     responses:
 *       200:
 *         description: Notification marked as read
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Notification not found
 */
router.patch(
    "/:id/read",
    markNotificationAsRead
);


/**
 * @swagger
 * /api/notifications/{id}:
 *   delete:
 *     summary: Delete a notification
 *     description: Deletes an existing notification.
 *     tags:
 *       - Notifications
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 6a78312cb19b7e0598b590d1
 *     responses:
 *       200:
 *         description: Notification deleted successfully
 *       400:
 *         description: Invalid notification ID
 *       404:
 *         description: Notification not found
 */
router.delete(
    "/:id",
    deleteNotification
);


module.exports = router;