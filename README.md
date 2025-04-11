# Yappie

## Desription ##
This document outlines specifications about Yappie, a web application designed for audiobook and podcast streaming. The document will serve as a reference point that connects development personnel with stakeholders and testers to ensure the understatement of the system functionality and design following Microservices Architecture.

## Intended Audience ##
Yappie is designed for:
- Users who enjoy listening to audiobooks and podcasts can visit the platform to stream or download them. They seek easy navigation through the platform and personalized content as well as the ability to listen offline.
- Administrators, as they are responsible for controlling the content displayed, managing user roles, ensuring that the displayed content complies with the platform’s regulations. 

## Services ##
 User Service :Responsible for user authentication and profile management.
 
Content Management Service : Responsible for managing audiobooks, podcasts and web app content management in general (e.g., CRUD operations for Admin).

Streaming Management Service : Responsible for streaming and managing playback for audiobooks/podcasts. Supports offline mode (downloads).

Notification Service :Responsible for sending real-time notifications to users for new episodes, reviews, and subscriptions.

Review & Rating Service : Responsible for allowing users to review/rate content and display engagement stats.

Search Service : Responsible for advanced search options (like searching by author, genre, or rating) and filters. 


## Technologies ##
Frontend: React, Tailwind

User Service: Flask, PostgreSQL, JWT + OAuth2

Content Management Service: Flask, MongoDB

Streaming Service: Go, MongoDB, Redis

Notification Service: Node.js, WebSockets, Kafka/RabbitMQ

Review & Rating Service: Express.js, MongoDB

Search Service: MongoDB Atlas Search

## Pre-requisites ##
Go (1.18 or later)
Node.js (16.x or later) 
MongoDB
Redis


## Acknowledgment ##
Malak Elbanna

Salma Ayman

El-hussain shalaby

Merna Ahmed
