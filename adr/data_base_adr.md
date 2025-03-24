# ADR: Database Choice

## Context
We need a database for our microservices. Each service has different needs, so we have to pick the right database for each one.

## Decision
- PostgreSQL for the User Service because it needs structured data and strong consistency.
- MongoDB for Content Management, Review & Rating, and Search Services since they handle flexible and unstructured data.

## Justification
- PostgreSQL is great for user data because it keeps everything organized and follows ACID rules.
- MongoDB works well with content and reviews since it can store different types of data without a fixed structure.

## Alternatives Considered
- MySQL – Similar to PostgreSQL but lacks some features we might need.
## Consequences
- Using different databases adds some complexity.
- But each service gets the best database for what it does.

## Status
Accepted 