## ADR: Load Balancing with HAProxy
## Context
Since our system has many services running, we need a way to distribute incoming traffic so no single service gets overwhelmed.

## Decision
We will use HAProxy to balance traffic between different service instances.

## Justification
Distributes Traffic : Makes sure requests are spread across multiple servers.

Handles Failures : If one service goes down, HAProxy directs traffic to a working one.
consistent hahsing :Helps route similar requests to the same backend, improving caching efficiency and session persistence.
Better Performance :Helps keep the system fast and prevents overload.

## Alternatives Considered
Nginx : primarily designed as a web server and reverse proxy. HAProxy, on the other hand, is built specifically for load balancing and offers better performance, advanced traffic control, and lower latency for our use case.

Cloud Load Balancers : provide scalability and reliability but come with additional costs and less control over fine-tuned configurations.

## Consequences
Setup and Configuration :HAProxy requires proper setup, including defining backend servers, load balancing algorithms, and failover handling.

## Status
Accepted 