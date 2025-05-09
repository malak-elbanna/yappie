# Yappie: Audiobook Website

## Report
    Salma Ayman - 202201191
    Malak Elbanna - 202200812
    Elhusseain Shalaby - 202202239
    Merna Ahmed - 202201530


## Project Summary
    Yappie is a scalable web application that allows users to stream and download audiobooks (aka a
    Spotify clone for audiobooks). This web application contains functionalities for user
    management, content administration, real-time notifications, and reviews and ratings. The web
    application is designed to be used on all devices and browsers.
    Yappie is a web app that follows the distributed microservices-based architecture. Each
    functional area is encapsulated within its own service.
    Technology Stack Overview:
        ● Frontend: Vite, React.js, Tailwind CSS
        ● Auth Service: Flask, PostgreSQL, JWT + OAuth
        ● Content Management Service: Flask, MongoDB, Minio
        ● Streaming Service: Go, MongoDB, Redis
        ● Notification Service: Express.js, WebSockets, RabbitMQ
        ● Review & Rating Service: Express.js, MongoDB
        ● Profile Management Service: Flask, PostgreSQL
        ● API Gateway: Kong (using plugins for load balancing and rate limiting)
        ● Logging and Monitoring: Loki, Promtail, Prometheus, Grafana
        ● Testing
            ○ Unit Testing: Jest, Pytest
            ○ Integration Testing: Pytest
            ○ Stress Testing: k

## Implementation Challenges and Solutions

### Challenges Faced:
    1. Polyglot persistence.
    2. Not knowing whether the services are ready or not.
    3. CORS restrictions blocking frontend requests to the backend.
    4. Share data between services and avoid tight coupling.
    5. Database dependencies creeping into unit tests
    6. Adding services through curl commands to Kong. So, everytime we rebuild the images,
        everything goes down.
    7. DB migrations needed to run manually for each used DB
    8. Impersistent DB data


### Solutions Implemented:
    1. Used migration tools like Alembic.
    2. Added health checks and logging for each service
    3. Configured CORS middleware in every service.
    4. Used JWTs to communicate between services.
    5. mocked all external dependencies in unit tests using pytest-mock
    6. Using a kong.yaml file that contains all the needed configurations
    7. Including entry points for these services
    8. Adding volumes at the end of the docker compose file

## Performance Evaluation

### Methodology and Tools:
    1. Load testing using k
    2. Integration testing using Pytest
    3. Monitoring and logging using Prometheus, Grafana, and Loki
    4. Unit testing using Pytest, go built-in testing packages,and jest

### Results and Findings:

    1. Load testing: average of 99.96% of checks passed.
    2. Integration testing: 14 tests passed.



