# 🎂 Cake Delight - Order Service

The **Order Service** is a Node.js and Express-based microservice responsible for managing customer orders in the Cake Delight application.

It communicates with the **Catalog Service** to validate cakes, check availability and stock, reduce stock when an order is created, and restore stock when an order is cancelled.

---

## 🚀 Features

- Create customer orders
- Get all orders
- Get an order by ID
- Update order status
- Cancel orders
- Validate cake availability
- Validate cake stock
- Calculate item subtotals
- Calculate total order amount
- Reduce cake stock after order creation
- Restore cake stock after order cancellation
- MongoDB persistence
- REST APIs
- Swagger API documentation
- Order Management UI
- Centralized error handling
- Request validation
- CORS support
- Docker support
- RabbitMQ event publishing
- Order completion and status events
- In-app notification popup integration

---

## 🛠️ Technology Stack

| Technology         | Purpose                       |
| ------------------ | ----------------------------- |
| Node.js            | JavaScript runtime            |
| Express.js         | REST API framework            |
| MongoDB            | Database                      |
| Mongoose           | MongoDB ODM                   |
| Joi                | Request validation            |
| Swagger            | API documentation             |
| Swagger UI Express | Interactive API documentation |
| CORS               | Cross-origin requests         |
| Nodemon            | Development server            |
| Docker             | Containerization              |

---

## 📁 Project Structure

```text
order-service/
│
├── public/
│   ├── index.html
│   ├── style.css
│   └── app.js
│
├── src/
│   ├── config/
│   │   └── database.js
│   │
│   ├── controllers/
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
│   │   └── Order.js
│   │
│   ├── routes/
│   │   └── orderRoutes.js
│   │
│   ├── services/
│   │   ├── orderService.js
│   │   └── catalogService.js
│   │
│   ├── utils/
│   │   └── apiResponse.js
│   │
│   ├── validators/
│   │   └── orderValidator.js
│   │
│   └── app.js
│
├── .env.example
├── .gitignore
├── Dockerfile
├── package.json
├── package-lock.json
├── README.md
└── server.js
```

---

## 🔄 Order Creation Flow

When a customer creates an order:

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
   │
   ├── Reduce cake stock
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
```

---

## ❌ Order Cancellation Flow

When an order is cancelled:

```text
Customer/Admin
      │
      ▼
Order Service
      │
      ├── Find Order
      │
      ├── Validate cancellation
      │
      ├── Restore cake stock
      │
      ▼
Catalog Service
      │
      └── Increase stock
      │
      ▼
Order Service
      │
      └── Set status = CANCELLED
```

---

## 📊 Order Status Flow

Orders follow controlled status transitions:

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

The service prevents invalid status transitions.

### Valid transitions

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

---

# 🔗 API Endpoints

Base URL:

```text
http://localhost:5002
```

## Create Order

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

The Order Service retrieves the cake information from the Catalog Service and calculates the final amount using the current catalog price.

---

## Get All Orders

```http
GET /api/orders
```

Returns all orders sorted by creation time.

---

## Get Order by ID

```http
GET /api/orders/{id}
```

Example:

```http
GET /api/orders/6a773cbcf0240e24a91ee059
```

---

## Update Order Status

```http
PATCH /api/orders/{id}/status
```

Example:

```json
{
  "status": "CONFIRMED"
}
```

Supported statuses:

```text
CONFIRMED
PREPARING
OUT_FOR_DELIVERY
DELIVERED
```

The service validates whether the requested status transition is allowed.

---

## Cancel Order

```http
PATCH /api/orders/{id}/cancel
```

Cancelling an order:

1. Finds the order
2. Validates whether cancellation is allowed
3. Restores the ordered cake quantities in the Catalog Service
4. Changes the order status to `CANCELLED`

---

# 📖 Swagger Documentation

Interactive Swagger documentation is available at:

```text
http://localhost:5002/api-docs
```

Swagger provides documentation and testing for all Order Service APIs.

Available endpoints:

```text
POST   /api/orders
GET    /api/orders
GET    /api/orders/{id}
PATCH  /api/orders/{id}/status
PATCH  /api/orders/{id}/cancel
```

---

# 🖥️ Order Management UI

The Order Service includes a web-based management interface.

Open:

```text
http://localhost:5002
```

The UI provides functionality for:

- Creating orders
- Selecting cakes
- Adding multiple cakes to an order
- Calculating order totals
- Viewing all orders
- Viewing individual orders
- Updating order status
- Cancelling orders
- Viewing API responses

---

# 🔗 Catalog Service Integration

The Order Service communicates with the Cake Delight Catalog Service.

Default Catalog Service URL:

```text
http://localhost:5001
```

The Order Service uses the Catalog Service to:

```text
GET /api/catalog/cakes/{id}
```

to retrieve cake information and:

```text
PATCH /api/catalog/cakes/{id}/stock
```

to reduce stock when an order is created.

The corresponding stock restoration operation is used when an order is cancelled.

---

# ⚙️ Environment Variables

Create a `.env` file in the project root.

Example:

```env
PORT=5002
MONGO_URI=mongodb://localhost:27017/order_db
CATALOG_SERVICE_URL=http://localhost:5001
```

Do not commit the `.env` file to GitHub.

---

# 📦 Installation

Clone the repository:

```bash
git clone <your-repository-url>
```

Navigate to the project:

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

---

# 🧪 Testing

The APIs can be tested using:

- Swagger UI
- Postman
- Order Management UI

Important scenarios include:

### Successful order

```text
Available cake
       +
Sufficient stock
       ↓
Order created
       +
Stock reduced
```

### Insufficient stock

```text
Requested quantity > available stock
       ↓
Order rejected
       +
Stock unchanged
```

### Order cancellation

```text
Order created
       ↓
Stock reduced
       ↓
Order cancelled
       ↓
Stock restored
```

### Invalid status transition

```text
PLACED → DELIVERED
       ↓
Rejected
```

---

# 🔐 Error Handling

The service handles:

- Invalid order data
- Invalid order ID
- Cake not found
- Cake unavailable
- Insufficient stock
- Invalid status transitions
- Invalid cancellation requests
- Database errors
- Catalog Service communication errors

---

# 🧩 Microservices Architecture

Cake Delight currently contains the following services:

```text
                  Cake Delight
                       │
             ┌─────────┴─────────┐
             │                   │
             ▼                   ▼
      Catalog Service      Order Service
          :5001                :5002
             │                   │
             │                   │
             └─────────┬─────────┘
                       │
                       ▼
                    MongoDB
```

### Catalog Service

Responsible for:

- Cake catalog
- Cake details
- Cake categories
- Cake prices
- Cake stock
- Cake availability
- Inventory operations

### Order Service

Responsible for:

- Customer orders
- Order items
- Order totals
- Order status
- Order cancellation
- Inventory interaction

---

# 🏗️ Architecture

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
     ▼
Models
     │
     ▼
MongoDB
```

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
- Docker Compose
- Kubernetes deployment
- Centralized logging
- Distributed tracing
- Message broker integration
- Notification Service

---

## 📄 License

This project is developed as part of the Cake Delight application.


---

# Event-Driven Notification Flow

After a successful checkout/order creation:

```text
Order Service
     |
     | ORDER_COMPLETED
     v
RabbitMQ
     |
     v
Notification Service
     |
     | Save notification
     v
Notification MongoDB
     |
     | GET /api/notifications/customer/{email}
     v
Order UI
     |
     v
In-app popup
```

Order status changes publish:

```text
ORDER_STATUS_UPDATED
```

The Notification Service converts these events into customer notifications.

The Order Service does not directly call the Notification Service for notification creation.

---

# RabbitMQ Environment

```env
RABBITMQ_URL=amqp://localhost:5672
EVENT_EXCHANGE=cake_delight_events
```

If RabbitMQ is temporarily unavailable, the order itself is still created and the publisher logs the broker error. The Notification Service retries its consumer connection automatically.

For production-grade guaranteed event delivery, an outbox pattern can be added later.
