## ADR: Message Broker Choice
Context
Some services need to communicate asynchronously, especially for notifications, activity tracking, and real-time updates. A message broker helps ensure reliable message delivery without overwhelming the system.

## Decision
We will use Kafka for event-driven communication and RabbitMQ for task queues.

## Justification
Kafka is great for real-time streaming and event processing (e.g., user activity logs, trending content tracking).

RabbitMQ is better for handling background tasks (e.g., sending notifications, processing payments).

## Alternatives Considered
Only using Kafka : More complex for simple tasks like notification delivery.

Only using RabbitMQ :Struggles with real-time event processing.

## Consequences
Increases infrastructure complexity but improves system  reliability.

## Status
Accepted