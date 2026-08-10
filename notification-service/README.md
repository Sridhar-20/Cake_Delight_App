# 🔔 Cake Delight - Notification Service

The **Notification Service** is a Node.js and Express-based microservice responsible for managing in-app customer notifications in the Cake Delight application.

The service receives order-related events from the **Order Service** through **RabbitMQ**, creates notification records in MongoDB, and provides REST APIs for retrieving, reading, and deleting notifications.

---

## 🚀 Features

### 🔔 Notification Management

- Create notifications
- Get all notifications
- Get notification by ID
- Get notifications by customer email
- Mark notifications as read
- Delete notifications

### 📨 RabbitMQ Event Consumption

The Notification Service acts as a **RabbitMQ consumer**.

It listens for order events published by the Order Service.

Supported events include:

- `ORDER_PLACED`
- `ORDER_CONFIRMED`
- `ORDER_PREPARING`
- `ORDER_OUT_FOR_DELIVERY`
- `ORDER_DELIVERED`
- `ORDER_CANCELLED`

When an order event is received, the Notification Service creates a corresponding notification in MongoDB.

---

## 🏗️ Architecture

```text
                     ┌──────────────────────┐
                     │    Catalog Service   │
                     │       Port 5001      │
                     └──────────┬───────────┘
                                │
                                │
                     ┌──────────▼───────────┐
                     │     Order Service    │
                     │       Port 5002      │
                     └──────────┬───────────┘
                                │
                                │ RabbitMQ
                                │ Order Events
                                ▼
                     ┌──────────────────────┐
                     │ Notification Service │
                     │       Port 5003      │
                     └──────────┬───────────┘
                                │
                                ▼
                           MongoDB
                                │
                                ▼
                     ┌──────────────────────┐
                     │  Notification UI    │
                     └──────────────────────┘
```

---

## 🔄 Notification Workflow

### 1. Customer creates an order

The customer creates an order through the Order Service.

```text
Customer
   │
   ▼
Order Service
   │
   ▼
Order Created
   │
   ▼
RabbitMQ
   │
   ▼
Notification Service
   │
   ▼
Create ORDER_PLACED Notification
   │
   ▼
MongoDB
```
