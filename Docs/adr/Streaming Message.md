# ADR: Decision to Choose Kafka as a Message Broker for Podcast Streaming

## Context
The Website implements real-time podcast streaming Feature. Hence, the use of a message broker which broadcasts data to all stream attending users is necessary.

## Decision
We decided to use Apache kafka as the message broker for this feature.

## Justification
- Commonly used Open Source Technology for real-time streaming pipelines.
- Supports Pub/Sub messaging, sending messages to all Consumers.
- Uses distributed logs to guarantee data durability and fault tolerance.

## Consequences
Pros
- High throughput: ensures smooth streaming experience to a large amount of concurrent users.
- Easy to scale: can integrate more brokers smoothly.

Cons
- Small data latency: not optimized for low-traffic scenarios. Better alternatives exist.
- Increased storage costs: Kafka retains data for a certain period of time. This leads to storing large amounts of persistent data.

## Status
Accepted
