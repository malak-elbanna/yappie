## ADR: Decision to Use Flask, Go, and Node.js for Backend Services
## Context
Our backend services need to be efficient, scalable, and well-suited to their specific tasks. Different services have different requirements, so using a single backend language might not be the best choice.

## Decision
We will use a combination of Flask, Go, and Node.js, assigning each technology based on its strengths.

## Justification
Flask for Authentication: Simple and lightweight, with strong libraries for handling OAuth, JWT, and user sessions.

Go for Streaming Services: Optimized for high-performance, low-latency concurrent processing, making it ideal for real-time audio streaming.

Node.js for Content Management: Handles multiple user requests efficiently, making it good  for managing books, user interactions, and search features.

## Consequences
Pros:
Optimized Performance: Each service uses the best-suited technology for its function.

Scalability: Services can be scaled independently based on demand.

Cons:
Increased Complexity: Requires maintaining multiple codebases with different languages.

Deployment Challenges: Each service has different dependencies and runtime environments.

Learnability: we must be familiar with multiple backend technologies which is time consuming.

## Status
Accepted