# ADR: Decision to choose OAuth and JWT for authentication

## Context
The system needs a secure and standardized method for authenticating users and services. The system's design require scalability and stateless session management. 

## Decision
We chose to implement **OAuth 2.0 with JWT (JSON Web Token)** serving as the selected token format for access and identity tokens.

## Justification
- Several programming languages such as Node.js and Go support existing libraries and frameworks.
- JWT works with scaling architectures such as microservices since it operates without requiring centralized session stores.
- OAuth 2.0 represents the standard protocol for delegated authorization which makes it appropriate for secure third-party authentication operations.
- OAuth with JWT provides user-based authentication coupled with client-based authentication which makes it suitable for service-to-service authorization.

## Alternatives Considered
- OAuth 2.0 with Opaque Tokens: smaller token size but requires introspection endpoints for validation, increasing latency.

## Consequences
Pros:
1. Reduced Database Queries: JWTs contain user information, servers can avoid querying the database for user details on every request, improving performance.
2. Cross-Origin Resource Sharing (CORS): JWTs can be used for secure cross-origin communication in web applications by including them in HTTP headers. 
3. Enhanced Security: OAuth 2.0 uses access tokens instead of user credentials, reducing the risk of a user's password being compromised. 

Cons: 
1. Token Size: JWTs can become large if they carry extensive user data, leading to increased network traffic.
2. Dependency on Third-Party Services: requires dependency on third-party services. If the third-party service suffers downtime or any security breaches, it can directly impact the OAuth 2.0 implementation. 

## Status
Accepted