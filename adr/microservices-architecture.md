## ADR: Microservices Architecture

##  Context
We're building a scalable, resilient, and secure web application, and we need to decide on the overall architectural style. Given the project requirements and the expected scale, we need to make a solid decision that aligns with our goals.

##  Decision
We will use a microservices architecture for the system instead of a monolithic design.

##  Justification
- Scalability : Each service can be scaled independently based on demand (e.g., streaming might need more resources than authentication).
- Flexibility : Different services can be built using different technology (e.g., Go for streaming, Flask for authentication).
- Resilience:If one service fails, it doesn’t take down the whole system.
- Easier Maintenance :make it easier to update and maintain.


## Consequences
- More services mean more deployments, service discovery, and monitoring.
- We need to decide when to use synchronous (REST) vs. asynchronous (Kafka/RabbitMQ) communication.


##  Alternatives Considered
- Monolithic Architecture → Simpler but doesn’t scale well for large applications.

## Status
 Accepted 