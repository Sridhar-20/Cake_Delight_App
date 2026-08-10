# 🎂 Cake Delight - Order Service

The **Order Service** is a Node.js and Express-based microservice responsible for managing customer baskets, checkout, orders, order status, order cancellation, inventory interaction, and order-related events in the Cake Delight application.

The service communicates with the **Catalog Service** to retrieve cake information, validate stock, reduce stock during checkout, and restore stock when an order is cancelled.

The service also publishes order events through **RabbitMQ**, which are consumed by the **Notification Service** to create customer notifications.

---

# 🚀 Features

## Basket Management

- Add cakes to a customer basket
- View customer basket
- Update basket item quantity
- Remove an item from basket
- Clear customer basket
- Calculate basket subtotal and total

## Order Management

- Create customer orders
- Checkout customer basket
- Get all orders
- Get an order by ID
- Update order status
- Cancel orders
- Validate order data
- Calculate item subtotals
- Calculate total order amount

## Catalog Integration

- Retrieve cake details from Catalog Service
- Validate cake availability
- Validate cake stock
- Reduce cake stock after checkout
- Restore cake stock after order cancellation

## Event-Driven Notifications

- Publish `ORDER_COMPLETED` events
- Publish `ORDER_STATUS_UPDATED` events
- Communicate with RabbitMQ
- Allow Notification Service to consume order events
- Support in-app customer notifications

## Other Features

- MongoDB persistence
- REST APIs
- Swagger/OpenAPI documentation
- Interactive Swagger UI
- Order Management UI
- Centralized error handling
- Request validation
- CORS support
- Docker support

---

# 🛠️ Technology Stack

| Technology         | Purpose                       |
| ------------------ | ----------------------------- |
| Node.js            | JavaScript runtime            |
| Express.js         | REST API framework            |
| MongoDB            | Database                      |
| Mongoose           | MongoDB ODM                   |
| Joi                | Request validation            |
| Swagger            | API documentation             |
| Swagger UI Express | Interactive API documentation |
| RabbitMQ           | Event/message broker          |
| amqplib            | RabbitMQ integration          |
| CORS               | Cross-origin requests         |
| Nodemon            | Development server            |
| Docker             | Containerization              |

---

# 📁 Project Structure

```text
order-service/
│
├── public/
│   ├── index.html
│   ├── style.css
│   └── app.js
│
├── src/
│   │
│   ├── config/
│   │   └── database.js
│   │
│   ├── controllers/
│   │   ├── basketController.js
│   │   └── orderController.js
│   │
│   ├── docs/
│   │   └── swagger.js
│   │
│   ├── middleware/
│   │   ├── errorMiddleware.js
│   │   └── notFoundMiddleware.js
│   │
│   ├── models/
│   │   ├── Basket.js
│   │   └── Order.js
│   │
│   ├── routes/
│   │   ├── basketRoutes.js
│   │   └── orderRoutes.js
│   │
│   ├── services/
│   │   ├── basketService.js
│   │   ├── catalogService.js
│   │   ├── messageBroker.js
│   │   └── orderService.js
│   │
│   ├── utils/
│   │   └── apiResponse.js
│   │
│   ├── validators/
│   │   └── orderValidator.js
│   │
│   └── app.js
│
├── .dockerignore
├── .env.example
├── .gitignore
├── Dockerfile
├── package.json
├── package-lock.json
├── README.md
└── server.js
```

---

# 🧺 Basket Management

The Basket is implemented **inside the Order Service** rather than as a separate microservice.

This keeps the architecture aligned with the project requirement of having four major business areas while allowing basket and checkout operations to remain closely associated with orders.

---

## Add Item to Basket

```http
POST /api/basket
```

Example request:

```json
{
  "customerEmail": "sridhar@gmail.com",
  "cakeId": "6a76b86dc51dbe305cae2e33",
  "quantity": 2
}
```

The Order Service communicates with the Catalog Service to validate the requested cake and stock before adding it to the basket.

---

## Get Customer Basket

```http
GET /api/basket/{customerEmail}
```

Example:

```http
GET /api/basket/sridhar@gmail.com
```

Returns the customer's current basket including:

- Cake details
- Quantity
- Price
- Item subtotal
- Basket total

---

## Update Basket Item Quantity

```http
PATCH /api/basket/{customerEmail}/{cakeId}
```

Example:

```http
PATCH /api/basket/sridhar@gmail.com/6a76b86dc51dbe305cae2e33
```

Request:

```json
{
  "quantity": 3
}
```

---

## Remove Basket Item

```http
DELETE /api/basket/{customerEmail}/{cakeId}
```

Example:

```http
DELETE /api/basket/sridhar@gmail.com/6a76b86dc51dbe305cae2e33
```

---

## Clear Basket

```http
DELETE /api/basket/{customerEmail}
```

Example:

```http
DELETE /api/basket/sridhar@gmail.com
```

---

# 🛒 Checkout Flow

Checkout converts the customer's basket into an order.

```http
POST /api/orders/checkout/{customerEmail}
```

Example:

```http
POST /api/orders/checkout/sridhar@gmail.com
```

The checkout process follows this flow:

```text
Customer
   │
   ▼
Order UI
   │
   ▼
Order Service
   │
   ├── Get Customer Basket
   │
   ├── Validate Basket
   │
   ├── Get Cake Details
   │
   ▼
Catalog Service
   │
   ├── Validate Cake
   ├── Check Availability
   └── Check Stock
   │
   ▼
Order Service
   │
   ├── Calculate Item Subtotals
   ├── Calculate Total
   ├── Reduce Stock
   │
   ▼
Catalog Service
   │
   └── Update Stock
   │
   ▼
MongoDB
   │
   └── Create Order
   │
   ▼
Clear Basket
   │
   ▼
RabbitMQ
   │
   └── ORDER_COMPLETED
```

---

# 🔄 Order Creation Flow

The Order Service supports direct order creation as well as basket checkout.

```text
Customer
   │
   ▼
Order Management UI
   │
   ▼
Order Service
   │
   ├── Validate order data
   │
   ├── Get cake details
   │
   ▼
Catalog Service
   │
   ├── Check cake
   ├── Check availability
   └── Check stock
   │
   ▼
Order Service
   │
   ├── Calculate subtotal
   ├── Calculate total
   ├── Reduce stock
   │
   ▼
Catalog Service
   │
   └── Update stock
   │
   ▼
MongoDB
   │
   └── Save Order
   │
   ▼
RabbitMQ
   │
   └── Publish ORDER_COMPLETED
```

---

# 📊 Order Status Flow

Orders follow controlled status transitions.

```text
                 ┌──► CONFIRMED
                 │        │
                 │        ▼
              PLACED ─► PREPARING
                 │        │
                 │        ▼
                 │   OUT_FOR_DELIVERY
                 │        │
                 │        ▼
                 │    DELIVERED
                 │
                 └──► CANCELLED
```

## Valid Transitions

```text
PLACED
 ├── CONFIRMED
 └── CANCELLED

CONFIRMED
 ├── PREPARING
 └── CANCELLED

PREPARING
 ├── OUT_FOR_DELIVERY
 └── CANCELLED

OUT_FOR_DELIVERY
 └── DELIVERED

DELIVERED
 └── No further transitions

CANCELLED
 └── No further transitions
```

The service rejects invalid status transitions.

Every successful status change publishes:

```text
ORDER_STATUS_UPDATED
```

through RabbitMQ.

---

# ❌ Order Cancellation Flow

When an order is cancelled:

```text
Customer/Admin
       │
       ▼
Order Service
       │
       ├── Find Order
       │
       ├── Validate Cancellation
       │
       ├── Restore Cake Stock
       │
       ▼
Catalog Service
       │
       └── Increase Stock
       │
       ▼
Order Service
       │
       ├── Set status = CANCELLED
       │
       └── Publish order event
       │
       ▼
RabbitMQ
```

---

# 🔗 API Endpoints

Base URL:

```text
http://localhost:5002
```

---

# 🧺 Basket APIs

| Method | Endpoint                               | Description            |
| ------ | -------------------------------------- | ---------------------- |
| POST   | `/api/basket`                          | Add cake to basket     |
| GET    | `/api/basket/{customerEmail}`          | Get customer basket    |
| PATCH  | `/api/basket/{customerEmail}/{cakeId}` | Update basket quantity |
| DELETE | `/api/basket/{customerEmail}/{cakeId}` | Remove basket item     |
| DELETE | `/api/basket/{customerEmail}`          | Clear basket           |

---

# 📦 Order APIs

| Method | Endpoint                               | Description                      |
| ------ | -------------------------------------- | -------------------------------- |
| POST   | `/api/orders`                          | Create order                     |
| GET    | `/api/orders`                          | Get all orders                   |
| GET    | `/api/orders/{id}`                     | Get order by ID                  |
| POST   | `/api/orders/checkout/{customerEmail}` | Checkout basket and create order |
| PATCH  | `/api/orders/{id}/status`              | Update order status              |
| PATCH  | `/api/orders/{id}/cancel`              | Cancel order                     |

---

# 📝 Create Order

```http
POST /api/orders
```

Example request:

```json
{
  "customerName": "Sridhar",
  "customerEmail": "sridhar@gmail.com",
  "customerPhone": "9876543210",
  "items": [
    {
      "cakeId": "6a76b87ac51dbe305cae2e35",
      "quantity": 2
    }
  ],
  "deliveryAddress": "Hyderabad",
  "paymentMethod": "COD"
}
```

The Order Service retrieves the cake information from the Catalog Service and calculates the final amount using the catalog price.

---

# 📋 Get All Orders

```http
GET /api/orders
```

Returns all orders sorted by creation time.

---

# 🔎 Get Order by ID

```http
GET /api/orders/{id}
```

Example:

```http
GET /api/orders/6a773cbcf0240e24a91ee059
```

---

# 🔄 Update Order Status

```http
PATCH /api/orders/{id}/status
```

Example:

```json
{
  "status": "CONFIRMED"
}
```

Supported status updates:

```text
CONFIRMED
PREPARING
OUT_FOR_DELIVERY
DELIVERED
```

---

# ❌ Cancel Order

```http
PATCH /api/orders/{id}/cancel
```

Cancelling an order:

1. Finds the order
2. Validates whether cancellation is allowed
3. Restores the ordered cake quantities in the Catalog Service
4. Changes the order status to `CANCELLED`
5. Publishes the corresponding order event

---

# 📖 Swagger Documentation

Interactive Swagger documentation is available at:

```text
http://localhost:5002/api-docs
```

Swagger provides interactive documentation and testing for the Order Service APIs.

The Swagger documentation includes:

```text
Basket
├── POST   /api/basket
├── GET    /api/basket/{customerEmail}
├── PATCH  /api/basket/{customerEmail}/{cakeId}
├── DELETE /api/basket/{customerEmail}/{cakeId}
└── DELETE /api/basket/{customerEmail}

Orders
├── POST   /api/orders
├── GET    /api/orders
├── GET    /api/orders/{id}
├── POST   /api/orders/checkout/{customerEmail}
├── PATCH  /api/orders/{id}/status
└── PATCH  /api/orders/{id}/cancel
```

---

# 🖥️ Order Management UI

The Order Service includes a web-based management interface.

Open:

```text
http://localhost:5002
```

The UI provides functionality for:

- Customer information entry
- Browsing available cakes
- Adding cakes to basket
- Updating basket quantities
- Removing basket items
- Clearing basket
- Viewing basket total
- Checkout
- Creating orders
- Viewing all orders
- Searching orders by ID
- Filtering orders by status
- Viewing individual orders
- Updating order status
- Cancelling orders
- Viewing API responses
- Displaying order-related notifications

---

# 🔗 Catalog Service Integration

The Order Service communicates with the Cake Delight Catalog Service.

Default Catalog Service URL:

```text
http://localhost:5001
```

The Catalog Service is responsible for cake information and stock management.

The Order Service uses the Catalog Service to:

```text
Get Cake
    │
    ▼
Validate Cake
    │
    ▼
Check Availability
    │
    ▼
Check Stock
    │
    ▼
Reduce Stock
```

When an order is cancelled:

```text
Order Cancellation
       │
       ▼
Restore Stock
       │
       ▼
Catalog Service
```

---

# 📨 RabbitMQ Event Integration

The Order Service uses RabbitMQ for asynchronous communication with the Notification Service.

The Order Service **does not directly call the Notification Service to create notifications**.

Instead, it publishes events.

---

## Order Completed Event

After successful checkout/order creation:

```text
Order Service
      │
      │ ORDER_COMPLETED
      ▼
RabbitMQ
      │
      ▼
Notification Service
      │
      ▼
Notification Database
```

---

## Order Status Updated Event

When the order status changes:

```text
Order Service
      │
      │ ORDER_STATUS_UPDATED
      ▼
RabbitMQ
      │
      ▼
Notification Service
      │
      ▼
Customer Notification
```

For example:

```text
PLACED
   ↓
CONFIRMED
   ↓
PREPARING
   ↓
OUT_FOR_DELIVERY
   ↓
DELIVERED
```

Each successful status transition can generate a corresponding customer notification.

---

# ⚙️ Environment Variables

Create a `.env` file in the project root.

Example:

```env
PORT=5002

MONGO_URI=mongodb://localhost:27017/order_db

CATALOG_SERVICE_URL=http://localhost:5001

RABBITMQ_URL=amqp://localhost:5672

EVENT_EXCHANGE=cake_delight_events
```

Do not commit the `.env` file to GitHub.

Use `.env.example` as the template.

---

# 📦 Installation

Clone the repository:

```bash
git clone <your-repository-url>
```

Navigate to the service:

```bash
cd order-service
```

Install dependencies:

```bash
npm install
```

Create the environment file:

```bash
copy .env.example .env
```

Update the values in `.env` if required.

---

# ▶️ Run in Development

Start the service:

```bash
npm run dev
```

Order Service:

```text
http://localhost:5002
```

Order Management UI:

```text
http://localhost:5002
```

Swagger:

```text
http://localhost:5002/api-docs
```

The following services should also be running for the complete workflow:

```text
Catalog Service       → http://localhost:5001
Order Service         → http://localhost:5002
Notification Service  → http://localhost:5003
RabbitMQ              → amqp://localhost:5672
MongoDB
```

---

# ▶️ Run in Production

```bash
npm start
```

---

# 🐳 Docker

Build the image:

```bash
docker build -t cake-delight-order-service .
```

Run the container:

```bash
docker run -p 5002:5002 --env-file .env cake-delight-order-service
```

The complete Cake Delight application can also be started using the project's Docker Compose configuration.

---

# 🧪 Testing

The APIs can be tested using:

- Swagger UI
- Postman
- Order Management UI

Important scenarios include:

## Successful Basket Flow

```text
Browse Cakes
      ↓
Select Cake
      ↓
Add to Basket
      ↓
Update Quantity
      ↓
View Basket
      ↓
Checkout
      ↓
Order Created
```

## Successful Checkout

```text
Available Cake
      +
Sufficient Stock
      ↓
Checkout
      ↓
Order Created
      +
Stock Reduced
      +
Basket Cleared
      +
ORDER_COMPLETED Event
```

## Insufficient Stock

```text
Requested Quantity > Available Stock
             ↓
       Checkout Rejected
             +
       Stock Unchanged
```

## Order Cancellation

```text
Order Created
      ↓
Stock Reduced
      ↓
Order Cancelled
      ↓
Stock Restored
```

## Invalid Status Transition

```text
PLACED → DELIVERED
      ↓
Rejected
```

---

# 🔐 Error Handling

The service handles:

- Invalid basket data
- Invalid order data
- Invalid order ID
- Invalid customer email
- Cake not found
- Cake unavailable
- Insufficient stock
- Invalid basket quantity
- Invalid status transitions
- Invalid cancellation requests
- Database errors
- Catalog Service communication errors
- RabbitMQ communication errors

---

# 🧩 Microservices Architecture

The Cake Delight application currently consists of three implemented microservices:

```text
                         Cake Delight
                              │
             ┌────────────────┼────────────────┐
             │                │                │
             ▼                ▼                ▼
      Catalog Service   Order Service   Notification Service
          :5001             :5002              :5003
             │                │                  ▲
             │                │                  │
             │                │              RabbitMQ
             │                │                  ▲
             │                └──────────────────┘
             │
             ▼
        Catalog DB

        Order Service
             │
             ▼
         Order DB

        Notification Service
             │
             ▼
      Notification DB
```

---

# 🏪 Catalog Service

Responsible for:

- Cake catalog
- Cake details
- Cake categories
- Cake prices
- Cake stock
- Cake availability
- Inventory operations

---

# 🛒 Order Service

Responsible for:

- Customer baskets
- Basket items
- Checkout
- Customer orders
- Order items
- Order totals
- Order status
- Order cancellation
- Catalog communication
- Inventory interaction
- RabbitMQ event publishing

---

# 🔔 Notification Service

The Notification Service consumes events published by the Order Service through RabbitMQ.

It is responsible for:

- Creating customer notifications
- Storing notifications
- Retrieving notifications
- Tracking read/unread state
- Providing notification APIs
- Displaying customer notifications through its UI

---

# 🏗️ Order Service Architecture

The Order Service follows a layered architecture:

```text
Client / UI
     │
     ▼
Routes
     │
     ▼
Controllers
     │
     ▼
Services
     │
     ├──────────────► Catalog Service
     │
     ├──────────────► RabbitMQ
     │
     ▼
Models
     │
     ▼
MongoDB
```

The main responsibilities are separated into:

```text
Routes
   ↓
Controllers
   ↓
Services
   ↓
External Services / Database
```

---

# 🔄 Complete Cake Delight Order Flow

The complete customer flow is:

```text
                 ┌─────────────────┐
                 │ Catalog Service │
                 │     :5001       │
                 └────────┬────────┘
                          │
                    Browse Cakes
                          │
                          ▼
                 ┌─────────────────┐
                 │  Order Service  │
                 │     :5002       │
                 └────────┬────────┘
                          │
                     Add to Basket
                          │
                          ▼
                       Checkout
                          │
                          ▼
                    Create Order
                          │
                          ├──────► Reduce Stock
                          │
                          ▼
                       RabbitMQ
                          │
              ┌───────────┴───────────┐
              │                       │
       ORDER_COMPLETED       ORDER_STATUS_UPDATED
              │                       │
              └───────────┬───────────┘
                          ▼
                ┌────────────────────┐
                │ Notification       │
                │ Service :5003      │
                └─────────┬──────────┘
                          │
                          ▼
                    Notification
                          │
                          ▼
                     Customer
```

---

# 🔔 Event-Driven Notification Flow

After successful checkout/order creation:

```text
Order Service
      │
      │ ORDER_COMPLETED
      ▼
RabbitMQ
      │
      ▼
Notification Service
      │
      │ Save Notification
      ▼
Notification MongoDB
      │
      ▼
Notification UI
```

When the order status changes:

```text
Order Service
      │
      │ ORDER_STATUS_UPDATED
      ▼
RabbitMQ
      │
      ▼
Notification Service
      │
      ▼
Notification MongoDB
      │
      ▼
Notification UI
```

The Order Service does not directly create notifications in the Notification Service.

RabbitMQ provides the asynchronous communication between the services.

---

# 🐇 RabbitMQ Environment

Example:

```env
RABBITMQ_URL=amqp://localhost:5672

EVENT_EXCHANGE=cake_delight_events
```

RabbitMQ is used as the message broker for order-related events.

The Notification Service consumes messages from the notification queue.

If RabbitMQ is temporarily unavailable, the Order Service can still create the order, while the broker error is logged.

For production-grade guaranteed event delivery, an outbox pattern can be added later.

---

# 📌 Future Enhancements

Possible future improvements include:

- User authentication
- JWT authorization
- Customer accounts
- Online payment integration
- Email order confirmation
- Customer order history
- API Gateway
- Service discovery
- Kubernetes deployment
- Centralized logging
- Distributed tracing
- Outbox pattern
- Retry/dead-letter queue strategy
- Production-grade observability

---

# 📄 License

This project is developed as part of the Cake Delight application.
