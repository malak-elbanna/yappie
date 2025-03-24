## ADR: Authentication Method
Context
Our platform needs a secure way for users to log in and access content. Since we support multiple login methods, including third-party authentication (Google, Facebook), we need a robust authentication system.

## Decision
We will use OAuth  with JWT (JSON Web Tokens) for authentication and session management.

## Justification
OAuth allows users to log in with third-party providers securely.

JWT enables stateless authentication, reducing database lookups and improving performance.

It works well with microservices since tokens can be passed between services without needing a centralized session store.

## Alternatives Considered
Session-based authentication : Requires a central session store, making it harder to scale.

## Consequences
Requires careful token expiration management to balance security and usability.

## Status
Accepted

