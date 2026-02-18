## Task Manager – MERN Stack Application

## Overview

Task Manager is a full-stack web application built using the MERN stack (MongoDB, Express.js, React, Node.js).
The main focus of this project is the backend architecture, including authentication with JWT, password hashing, protected routes, and user-based task management.

This project represents the first application in a four-project portfolio focused on backend development and secure API design.


## Tech Stack
- Backend:
    - Node.js
    - Express.js
    - MongoDB
    - Mongoose
    - JSON Web Token (JWT)
    - bcryptjs
    - dotenv

- Frontend:
    - React (Vite)
    - React Router DOM
    - Axios
    - CSS


## Architecture
The project is structured in two main folders:
```
task-manager/
 ├── server/
 └── client/
```
Backend Structure
```
server/
 ├── models/
 │    ├── user.js
 │    └── task.js
 ├── routes/
 │    ├── auth.js
 │    └── tasks.js
 ├── middleware/
 │    └── authMiddleware.js
 ├── server.js
```
The backend is designed following REST principles and includes authentication middleware to protect private routes. 
Environment variables are managed through a local `.env` file (not included in the repository).



## Backend Features
- User Authentication
    - User registration with hashed passwords (bcrypt)
    - Login with credential validation
    - JWT token generation
    - Token expiration management
    - Secure password comparison

- Authorization & Protected Routes
    - Custom authentication middleware
    - JWT verification
    - User-specific data access
    - 401 responses for unauthorized access
Only authenticated users can create, read, update, or delete their own tasks.

- Task Management
Each task is associated with a specific user.
Implemented operations:

    - Create task
    - Get all tasks (user-specific)
    - Update task (toggle completed status)
    - Delete task
Tasks are stored with timestamps using Mongoose schema options.

## API Endpoints
Authentication:

    POST /api/auth/register
    POST /api/auth/login

    Tasks (Protected – require Authorization header with JWT):

    GET /api/tasks
    POST /api/tasks
    PUT /api/tasks/:id
    DELETE /api/tasks/:id


## Security Implementation
- Password hashing with bcrypt
- JWT-based authentication
- Middleware-based route protection
- Environment variables for secret management
- User ownership validation for tasks


## Frontend Features
- User registration page
- Login page
- Dashboard with task list
- Task creation
- Task completion toggle (checkbox)
- Persistent authentication via localStorage
- Clean and centered UI with reusable CSS structure
The frontend communicates with the backend using Axios and sends the JWT in the Authorization header.


## Database Design
- User Schema
    - username (unique)
    - email (unique)
    - password (hashed)
    - timestamps

- Task Schema
    - title
    - completed (Boolean)
    - user (ObjectId reference)
    - timestamps


## How to Run the Project

- Backend
    cd server
    npm install
    npm run dev

Make sure to create a .env file containing:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

Server runs on:

http://localhost:5000

- Frontend
    cd client
    npm install
    npm run dev

Frontend runs on:

http://localhost:5173


## Learning Focus

This project emphasizes:
- Building a secure REST API
- Implementing authentication from scratch
- Structuring a scalable backend architecture
- Managing user-based data with MongoDB
- Connecting a React frontend to a protected API

The backend implementation is the core strength of this project and demonstrates understanding of authentication, authorization, and database modeling.


## Challenges Faced & Solutions

During the development of this project several technical issues were encountered and resolved, contributing to a deeper understanding of full-stack application architecture.

- Authentication debugging  
  Login failures were caused by mismatched field names between frontend and backend. The issue was resolved by aligning request payloads and schema fields.

- Middleware and protected routes  
  Initial errors in accessing protected endpoints were fixed by correctly importing authentication middleware and ensuring the JWT token was sent in request headers.

- Environment configuration  
  MongoDB connection and environment variable setup required adjustments to properly load `.env` variables and start the database service.

- Frontend dependency and routing issues  
  Missing packages and incorrect imports were identified and resolved, stabilizing the client-side routing and API communication.



## Author

Aurora Pantaleo
Full-stack development portfolio project – 2026