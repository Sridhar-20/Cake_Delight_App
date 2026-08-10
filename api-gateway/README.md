# 🎂 Cake Delight - API Gateway

The API Gateway is the single entry point for client requests in the Cake Delight microservices architecture.

It routes API requests to the appropriate backend microservice using HTTP proxying.

---

## 🚀 Features

- Centralized API entry point
- Request routing
- Service abstraction
- CORS support
- JSON request handling
- Health check
- Error handling

---

## 🏗️ Architecture

Client
|
v
API Gateway :5000
|
+---- /api/catalog/_ ------> Catalog Service :5001
|
+---- /api/orders/_ -------> Order Service :5002
|
+---- /api/notifications/_ -> Notification Service :5003
|
+---- /api/ratings/_ ------> Rating Service :5004

---

## 🔀 API Routes

| Gateway Route          | Target Service       |
| ---------------------- | -------------------- |
| `/api/catalog/*`       | Catalog Service      |
| `/api/orders/*`        | Order Service        |
| `/api/notifications/*` | Notification Service |
| `/api/ratings/*`       | Rating Service       |

---

## 🔗 Examples

### Catalog

GET:

http://localhost:5000/api/catalog/cakes

GET by ID:

http://localhost:5000/api/catalog/cakes/:id

---

### Orders

GET:

http://localhost:5000/api/orders

GET by ID:

http://localhost:5000/api/orders/:id

---

### Ratings

GET:

http://localhost:5000/api/ratings

GET by ID:

http://localhost:5000/api/ratings/:id

---

### Notifications

GET:

http://localhost:5000/api/notifications

GET by ID:

http://localhost:5000/api/notifications/:id

---

## ❤️ Health Check

GET:

http://localhost:5000/health

Response:

{
"success": true,
"message": "API Gateway is running"
}

---

## ⚙️ Environment Variables

PORT=5000

CATALOG_SERVICE_URL=http://localhost:5001/api/catalog
ORDER_SERVICE_URL=http://localhost:5002/api/orders
NOTIFICATION_SERVICE_URL=http://localhost:5003/api/notifications
RATING_SERVICE_URL=http://localhost:5004/api/ratings

---

## ▶️ Running the Service

Install dependencies:

npm install

Start development server:

npm run dev

Start production server:

npm start
