# Cake Delight - Current Service Alignment Patch

This patch updates the three existing services to better match the capstone requirements.

## Changed

### Catalog Service
- Added a real Dockerfile.
- Added `.dockerignore`.
- Kept existing catalog APIs and MongoDB ownership unchanged.

### Order Service
- Removed direct Order Service -> Notification Service HTTP notification creation.
- Added RabbitMQ event publisher.
- Publishes `ORDER_COMPLETED` after successful order creation.
- Publishes `ORDER_STATUS_UPDATED` for status changes/cancellation.
- Added in-app notification polling and popup to the Order UI.
- Added `/health`.
- Added Dockerfile and `.dockerignore`.
- Added RabbitMQ configuration.
- Added `docker-compose.yml` for later container-based execution.

### Notification Service
- Added RabbitMQ event consumer.
- Consumes `ORDER_COMPLETED` and `ORDER_STATUS_UPDATED`.
- Creates notifications in its own MongoDB.
- Added event ID deduplication.
- Kept REST notification APIs for testing/retrieval.
- Added `/health`.
- Added Dockerfile and `.dockerignore`.
- Added RabbitMQ configuration.
- Added README.

## Important

The following capstone requirements are NOT yet implemented in these three services:

- Rating Microservice
- API Gateway
- Full persistent Basket workflow
- Kubernetes manifests

Those should be added as the next development phases instead of mixing unrelated changes into the existing services.

## Local development

The three Node.js services can still be run directly with MongoDB.

For event-driven notification testing, RabbitMQ must also be running on:

```text
amqp://localhost:5672
```

The Node services automatically retry their RabbitMQ connection if the broker is unavailable.

## Dependency installation

Because `amqplib` was added to Order and Notification Service, run:

```bash
cd order-service
npm install

cd ../notification-service
npm install
```

This updates `package-lock.json` with the new dependency.

## Container execution later

When Docker is available:

```bash
docker compose up --build
```

The current compose setup includes:

- Catalog Service
- Order Service
- Notification Service
- RabbitMQ
- separate MongoDB containers for each service

Kubernetes is intentionally not included in this patch because Rating and API Gateway still need to be added first.
