##### yappie #####

### Desription ###
This document outlines specifications about Yappie, a web application designed for audiobook and podcast streaming. The document will serve as a reference point that connects development personnel with stakeholders and testers to ensure the understatement of the system functionality and design following Microservices Architecture.

## Services ##
 User Service :Responsible for user authentication and profile management.
Content Management Service : Responsible for managing audiobooks, podcasts and web app content management in general (e.g., CRUD operations for Admin).
Streaming Management Service : Responsible for streaming and managing playback for audiobooks/podcasts. Supports offline mode (downloads).
Notification Service :Responsible for sending real-time notifications to users for new episodes, reviews, and subscriptions.
Review & Rating Service : Responsible for allowing users to review/rate content and display engagement stats.
Search Service : Responsible for advanced search options (like searching by author, genre, or rating) and filters. 


## Technologies ##
Frontend: HTML, JavaScript
User Service: Flask, PostgreSQL, JWT + OAuth2
Content Management Service: Flask, MongoDB, AWS S3 or Firebase
Streaming Service: Go, Redis
Notification Service: Node.js, WebSockets, Kafka/RabbitMQ
Review & Rating Service: Express.js, MongoDB
Search Service: MongoDB Atlas Search

## Pre-requisites ##
Go (1.18 or later)
Node.js (16.x or later) 
MongoDB
Redis



## Contributing ## 
Follow these steps to contribute:
Fork the repository.
Create a new branch:
Make your changes and commit them:
Push to your branch:
Open a pull request.


## Acknowledgment ##
Malak Elbanna
Salama Ayman
El -hussain shalaby
Merna Ahmed 







###
