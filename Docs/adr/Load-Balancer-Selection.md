# ADR: Decision to choose HAProxy as system's load balancer

## Context
For our Microservices based architecture, we will create several instances for each service for better system performance and to avoid single point of failure. Distributing Users requests between these instances is crucial, hence whey we need to choose a load balancer.

## Decision
We chose HAProxy , an open source reverse proxy, to implement Load balancing.

## Justification
- HAProxy is free,
- It is open Source, providing flexibility in modifying its features according to our needs.
- HAProxy utilises consistent hashing, allowing for better up and down scaling of system instances by minimizing rehashing.
- Supports both Layer 4 and Layer 7 load balancing.

## Consequences
Pros:
1. High Availabilty: automatically remove unavailable instances.
2. High Performance: fast and smart switching of instances, ensuring minimal distruption to instances distribution.
3. Session Persistence: ensures clients route to same specific instances, as long as the distribution is not changed.

Cons:
1. Steeper learning curve: more challenging to configure than NGINX.
2. Basic stats page: would need to integrate with more advanced monitoring software, such as Grafana.



## Status
