# Cake Delight - Notification Service

The Notification Service owns in-app order notifications.

## Responsibility

- Store notifications in MongoDB
- Consume order events from RabbitMQ
- Create notifications from order completion/status events
- Retrieve customer notifications
- Mark notifications as read
- Delete notifications
- Expose Swagger documentation
- Provide a simple notification testing UI

## Event-driven flow

```text
Order Service
     |
     | ORDER_COMPLETED / ORDER_STATUS_UPDATED
     v
RabbitMQ
     |
     v
Notification Service
     |
     v
MongoDB
     |
     v
Order UI polls notifications
     |
     v
In-app popup
```

The Order Service does not directly call the Notification Service to create a notification.

## APIs

```text
POST   /api/notifications
GET    /api/notifications
GET    /api/notifications/customer/{email}
GET    /api/notifications/{id}
PATCH  /api/notifications/{id}/read
DELETE /api/notifications/{id}
```

`POST /api/notifications` remains available for direct API testing. Normal order notifications are created by RabbitMQ event consumption.

## Environment

```env
PORT=5003
MONGODB_URI=mongodb://localhost:27017/cake_delight_notifications
RABBITMQ_URL=amqp://localhost:5672
EVENT_EXCHANGE=cake_delight_events
NOTIFICATION_QUEUE=notification_service_queue
```

## Run

```bash
npm install
npm run dev
```

Service:

```text
http://localhost:5003
```

Swagger:

```text
http://localhost:5003/api-docs
```

## RabbitMQ

RabbitMQ must be running for event-driven notifications.

If RabbitMQ is unavailable, the Notification Service still starts and retries the broker connection every five seconds.

## Docker

```bash
docker build -t cake-delight-notification-service .
docker run -p 5003:5003 --env-file .env cake-delight-notification-service
```
