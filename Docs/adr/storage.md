## ADR: Choosing AWS S3 and Firebase for Storage
## Context
Our platform needs a place to store and serve a lot of audiobook and podcast files. It should be reliable, able to handle many users at once, and work well with our backend. Fast access is also important, especially for mobile users.

## Decision
We decided to use AWS S3 as our main storage and Firebase Storage as a backup, especially for mobile users.

Justification
scalability: AWS S3 can store unlimited data and handle high traffic without slowing down.

reliability: It stores files in multiple locations, so even if one goes down, our content is still available.

 AWS S3 integrates with our backend and supports CDN caching, which helps content load faster.

Why Firebase? It’s great for mobile users because it offers real-time access and built-in authentication, making things easier to manage.

## Consequences
## Pros:
Users can access content anytime, even if part of the system has issues.
Supports encryption and access control to protect files.
Users can stream content smoothly from anywhere.

## Cons:
 Can Be Slow for Large Files: AWS S3 might take longer to load big files unless optimized.
 Costs Add Up: Storing more files increases expenses, so we need to monitor costs.
 Firebase Has Limits: Not ideal for high-bandwidth needs due to storage restrictions.

## Status
Accepted 