# Yappie

## Description ##
Yappie is a scalable web application that allows users to stream and download audiobooks (aka a Spotify clone for audiobooks). This web application contains functionalities for user management, content administration, real-time notifications, and reviews and ratings. The web application is designed to be used on all devices and browsers.

## Intended Audience ##
Yappie is designed for:
- Users who enjoy listening to audiobooks and podcasts can visit the platform to stream or download them. They seek easy navigation through the platform and personalized content as well as the ability to listen offline.
- Administrators, as they are responsible for controlling the content displayed, managing user roles, ensuring that the displayed content complies with the platform’s regulations. 

## Services ##
- Authentication Service :Responsible for user authentication and authorization

- Profile Management Service: Responsible for user profile management
 
- Content Management Service : Responsible for managing audiobooks, podcasts and web app content management in general (e.g., CRUD operations for Admin).

- Streaming Service : Responsible for streaming and managing playback for audiobooks/podcasts. Supports offline mode (downloads), live streaming, and browsing functionalities.

- Notification Service :Responsible for sending real-time notifications to users for new episodes, reviews, and subscriptions.

- Review & Rating Service : Responsible for allowing users to review/rate content and display engagement stats.

## Techn Stack Overview ##
- Frontend: Vite, React.js, Tailwind CSS
- Auth Service: Flask, PostgreSQL, JWT + OAuth2
- Content Management Service: Flask, MongoDB, Minio
- Streaming Service: Go, MongoDB, Redis
- Notification Service: Express.js, WebSockets, RabbitMQ
- Review & Rating Service: Express.js, MongoDB
- Profile Management Service: Flask, PostgreSQL
- API Gateway: Kong (using plugins for load balancing and rate limiting)
- Logging and Monitoring: Loki, Promtail, Prometheus, Grafana
- Testing
    - Unit Testing: Jest, Pytest
    - Integration Testing: Pytest
    - Stress Testing: k6

## Pre-requisites ##
1. Docker (Most Important)
2. Go (1.18 or later)
3. Node.js (16.x or later) 
4. MongoDB
5. Redis

## How to Run The Project ## 
1. Make your .env files (according to the service structure)
2. Run the scripts in the `/audiobooks` directory to build your MongoDB
3. Run the following commands in your terminal
```bash
cd src
docker-compose up --build
```
4. Go to `http://localhost:5173`

## Screenshots ##

### Home Page
![Home Page](Screenshots\Home.png)

### About Us Page
![About Us Page](Screenshots\AboutUs.png)

### Sign Up / Login Page
![Sign Up / Login Page](Screenshots\Login.png)

### User Profile Page
![User Profile](Screenshots\Profile.png)

### Books Page
![Books Page](Screenshots\Books.png)

### Book Details Page
![Book Details Page](Screenshots\BookDetails.png)

### Books Categories Page
![Books Categories Page](Screenshots\BooksCategories.png)

### Category Details Page
![Category Details Page](Screenshots\CategoryDetails.png)

### All Live Streams Page
![All Live Streams Page](Screenshots\AllLives.png)

### Live Stream (Broadcaster View)
![Live Stream (Broadcaster View)](Screenshots\LiveStream_broadcast.png)

### Live Stream (Listener View)
![Live Stream (Listener View)](Screenshots\LiveStream_Listener.png)

### Downloads Page
![Downloads Page](Screenshots\Downloads.png)

## Developers ##
1. Malak Elbanna
2. Salma Ayman
3. Al-Hussain Shalaby
4. Merna Ahmed 