# Cake Delight - Catalog Microservice

## 1. Overview

The Catalog Microservice is responsible for managing cake information
for the Cake Delight application.

It provides REST APIs for:

- Creating cakes
- Retrieving cakes
- Updating cakes
- Deleting cakes
- Searching cakes by name
- Filtering cakes by category
- Filtering cakes by price range
- Retrieving available cakes

The service also provides a simple web-based frontend for interacting
with the Catalog APIs.

---

## 2. Features

- Cake CRUD operations
- Search cakes by name
- Filter cakes by category
- Filter cakes by price range
- Retrieve available cakes
- Pagination
- Sorting
- Request validation
- Centralized error handling
- MongoDB database integration
- Swagger API documentation
- Simple frontend UI
- Health check endpoint
- CORS support
- Security headers using Helmet
- HTTP request logging using Morgan

---

## 3. Technology Stack

| Technology        | Purpose                         |
| ----------------- | ------------------------------- |
| Node.js           | JavaScript runtime              |
| Express.js        | REST API framework              |
| MongoDB           | Database                        |
| Mongoose          | MongoDB object modeling         |
| Joi               | Request validation              |
| Swagger / OpenAPI | API documentation               |
| HTML              | Frontend structure              |
| CSS               | Frontend styling                |
| JavaScript        | Frontend API communication      |
| Helmet            | Security headers                |
| CORS              | Cross-origin requests           |
| Morgan            | HTTP request logging            |
| dotenv            | Environment variable management |

---

## 4. Architecture

The Catalog Service follows a layered microservice architecture.

```text
Client / Frontend
       |
       v
   REST Routes
       |
       v
   Controllers
       |
       v
    Services
       |
       v
     Model
       |
       v
    MongoDB
```
