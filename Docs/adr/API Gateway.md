# ADR: Kong for API Gateway

## Context
Our application would benefit from implementing an API Gateway that routes requests to the specified microservice. 

## Decision
- Use Kong for implementing an API gateway to connect between services.

## Justification
- Supports JWT and OAuth2 authentication.
- Supports rate limiting which ensures API fair usage.
- Supports resilience strategies including retries and circuit breakers.
- Supports scalability since this is one of our architecture drivers.

## Alternatives Considered
- NGINX – A lightweight solution but requires manual setup for most features.

## Consequences
- Requires setup effort which increases complexity of usage.

## Status
Accepted 