# ⭐ Cake Delight - Rating Service

The **Rating Service** is a Node.js and Express-based microservice responsible for managing customer ratings and reviews for cakes in the Cake Delight application.

Customers can create ratings, view ratings, update their ratings, and delete their ratings. The service communicates with the **Catalog Service** to retrieve cake information for the Rating UI.

---

## 🚀 Features

### ⭐ Rating Management

- Create a rating and review
- Get all ratings
- Get a rating by ID
- Get ratings for a specific cake
- Update an existing rating
- Delete a rating
- Prevent duplicate ratings from the same customer for the same cake
- Validate rating and review data

### 🎂 Catalog Integration

The Rating Service UI communicates with the Catalog Service to load available cakes.

Catalog Service:

```text
http://localhost:5001
```
