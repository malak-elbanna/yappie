# ADR: Decision to choose Redis for caching

## Context
The system consists of services such as, notification service and streaming service that require quick access to frequently accessed data and high throughput rate for real-time interactions.

## Decision
We chose Redis as our caching solution to store frequently streamed audio content, active users sessions, recent notifications, and user playback states.

## Justification
- Redis is known for its high performance, low latency, and support for various data.
- Reduces database load and improve respose times.
- Redis is well-supported in multiple coding languages such as, Go and NodeJS, allowing easy integration to our microservices.
- Redis includes a built-in TTL that is ideal for temporary or expiring data like notifications.

## Consequences
Pros:
1. Offloads repetitive queries from databases.
2. Reliable for caching session states and user playback states.
3. Low latency for write/read operations.

Cons:
1. Volatile memory: reliance on RAM for data storage can limit scalability and increase costs as data volumes increase.
2. Single-threaded design: Redis' design can become a bottleneck in high throughput environments when demands for concurrent data processing outstrip its capabilities.   

## Status
Accepted 