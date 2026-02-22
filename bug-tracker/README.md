## Bug Tracker – MERN Stack Application

## Overview

Bug Tracker is a full-stack web application built using the MERN stack (MongoDB, Express.js, React, Node.js).

The application allows authenticated users to create, manage, track, update, and comment on software issues.  
The main focus of this project is extending backend architecture with issue lifecycle management, filtering logic, relational data modeling, and structured REST API design.

This project represents the second application in a four-project portfolio focused on backend development, authentication systems, and scalable API architecture.


## Tech Stack
- Backend:
    - Node.js
    - Express.js
    - MongoDB
    - Mongoose
    - JSON Web Token (JWT)
    - bcryptjs
    - dotenv
    - CORS

- Frontend:
    - React (Vite)
    - React Router DOM
    - Axios
    - CSS


## Architecture
The project is structured in two main folders:
```
bug-tracker/
 ├── server/
 └── client/
```
Backend Structure
```
server/
├── models/
│   ├── user.js
│   └── issue.js
│
├── routes/
│   ├── auth.js
│   └── issues.js
│
├── middleware/
│   └── authMiddleware.js
│
├── server.js
├── package.json
├── package-lock.json
└── .env (not included in repository)
```

The backend follows REST principles and includes authentication middleware to protect private routes.  
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
Only authenticated users can manage their own issues and comments.

- Issue Management
Each issue is associated with a specific user.
Implemented operations:

    - Create issue
    - Get all issues (user-specific)
    - Get single issue
    - Update issue (status, priority, labels)
    - Delete issue

Issues support lifecycle states:

    - open
    - in_progress
    - closed

Filtering is implemented for status, priority, and labels.

- Comment System
Each issue supports comments.
Implemented operations:

    - Add comment
    - Delete comment
    - Retrieve comments within issue detail

Comments are stored as embedded subdocuments with author reference and timestamps.



## API Endpoints

Authentication:

    POST /api/auth/register
    POST /api/auth/login

Issues (Protected – require Authorization header with JWT):

    GET /api/issues
    GET /api/issues/:id
    POST /api/issues
    PUT /api/issues/:id
    DELETE /api/issues/:id

Comments (Protected):

    POST /api/issues/:id/comments
    DELETE /api/issues/:issueId/comments/:commentId



## Security Implementation
- Password hashing with bcrypt
- JWT-based authentication
- Middleware-based route protection
- Environment variables for secret management
- User ownership validation for issues
- Protected comment operations

Only authenticated users can access and modify their own data.



## Frontend Features
- User registration page
- Login page
- Issues dashboard with filtering system
- Create new issue page
- Issue detail page with comments
- Edit and delete issue functionality
- Delete comment functionality
- Color-coded priority indicators
- Visual distinction for closed issues (dimmed state)
- Persistent authentication via localStorage
- Structured and centered UI layout

The frontend communicates with the backend using Axios and sends the JWT in the Authorization header.



## Database Design

- User Schema
    - username (unique)
    - email (unique)
    - password (hashed)
    - timestamps

- Issue Schema
    - title
    - description
    - status (enum: open, in_progress, closed)
    - priority (enum: low, medium, high, critical)
    - labels (Array of Strings)
    - createdBy (ObjectId reference)
    - assignedTo (ObjectId reference, optional)
    - comments (embedded subdocuments)
        - text
        - author (ObjectId reference)
        - createdAt
    - timestamps



## How to Run the Project

- Backend
    cd server
    npm install
    npm run dev

Make sure to create a `.env` file containing:

MONGO_URI=your_mongodb_connection_string  
JWT_SECRET=your_secret_key  

Server runs on:

http://localhost:5001

- Frontend
    cd client
    npm install
    npm run dev

Frontend runs on:

http://localhost:5173



## Learning Focus

This project emphasizes:
- Designing structured REST APIs with relational logic in MongoDB
- Managing issue lifecycle states
- Implementing nested subdocuments
- Building filtering systems on the backend
- Extending authentication systems
- Connecting protected backend routes to a React frontend
- Handling UI state synchronization with backend data

The backend implementation demonstrates growth from basic CRUD logic to more structured data modeling and lifecycle management.



## Challenges Faced & Solutions

During the development of this project several technical issues were encountered and resolved, contributing to a deeper understanding of full-stack architecture.

- ObjectId casting errors  
  Incorrect ID handling in routes caused validation failures. The issue was resolved by ensuring proper parameter usage and testing endpoints carefully.

- Comment schema placement  
  The comments field was initially misplaced outside the schema definition. The schema was restructured to correctly embed subdocuments within the Issue model.

- Middleware integration issues  
  Token validation errors were resolved by standardizing Authorization header handling and verifying JWT decoding logic.

- Dependency resolution  
  Missing packages such as bcryptjs caused runtime crashes. The issue was resolved by properly installing dependencies and verifying module imports.

- CSS layout alignment  
  Sidebar and content alignment required restructuring spacing logic to ensure consistent vertical positioning across the layout.



## Author

Aurora Pantaleo  
Junior Full-stack development portfolio project – 2026