## Calend-u – MERN Stack Application

## Overview
Calend-U is a full-stack appointment booking application built using the MERN stack (MongoDB, Express.js, React, Node.js).

The application allows a host to define weekly availability and enables guests to book 30-minute time slots dynamically.

The main focus of this project is backend-driven slot generation, conflict detection logic, dynamic availability modeling, and structured REST API design.

This project represents the third application in a four-project portfolio focused on backend architecture, scheduling logic, and real-world API systems.

## Tech Stack
- Backend:
    - Node.js
    - Express.js
    - MongoDB
    - Mongoose
    - CORS
    - dotenv

- Frontend:
    - React (Vite)
    - React Router DOM
    - Axios
    - CSS (inline styling)

## Architecture
The project is structured in two main folders:
```
calend-u/
 ├── server/
 └── client/
```
Backend Structure
```
server/
├── models/
│   ├── user.js
│   ├── availability.js
│   └── booking.js
│
├── routes/
│   ├── auth.js
│   ├── availability.js
│   └── bookingRoutes.js
│
├── middleware/
│   └── authMiddleware.js
│
├── utils/
│   └── slotGenerator.js
│
├── server.js
├── package.json
└── .env (not included in repository)
```
The backend follows REST principles and includes dynamic slot generation based on stored weekly availability.

Environment variables are managed through a local .env file (not included in the repository).

## Backend Features
- Availability Management
    Each host defines weekly recurring availability:
        - dayOfWeek (0–6)
        - startTime
        - endTime
        - slotDuration
Availability is stored once and used to dynamically generate daily slots.

- Dynamic Slot Generation
    Slots are NOT stored in the database.
    Instead:
        - The system reads weekly availability
        - Generates time slots for a selected date
        - Excludes already booked time intervals
        - Returns only available slots
This reduces database redundancy and ensures real-time availability.

- Booking System
    - Implemented operations:
        - Create booking for specific host and slot
        - Prevent double booking
        - Validate time conflicts
        - Store guest information

    - Each booking includes:
        - host reference
        - guestName
        - guestEmail
        - start time
        - end time
        - status

## API Endpoints
Availability:
```
GET /api/availability/slots?hostId=ID&date=YYYY-MM-DD
POST /api/availability
GET /api/availability
```
Bookings:
```
POST /api/bookings/hosts/:hostId/slot
GET /api/bookings
```
Authentication (if enabled):
```
POST /api/auth/register
POST /api/auth/login
```
## Conflict Detection Logic
The system prevents overlapping bookings by checking:
- Existing bookings for same host
- Overlapping time intervals
- Exact start/end conflicts
Only non-conflicting slots are returned to the frontend.

## Frontend Features
- Interactive monthly calendar (Monday-first layout)
- Dynamic slot rendering based on selected date
- Manual date input
- Clickable slot selection
- Booking form with validation
- Success confirmation page
- Loading and error states
- Clean centered UI layout
- Real-time backend synchronization
The frontend communicates with the backend using Axios.

## Database Design
- User Schema
    - name
    - email
    - password (optional if auth enabled)
    - timestamps

- Availability Schema
    - user(ObjectId reference)
    - dayOfWeek
    - startTime
    - endTime
    - slotDuration
    - timestamps

- Booking Schema
    - host (ObjectId reference)
    - guestName
    - guestEmail
    - start
    - end
    - status
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

http://localhost:5002

- Frontend
    cd client
    npm install
    npm run dev

Frontend runs on:

http://localhost:5173

## Learning Focus
This project emphasizes:
- Designing scheduling systems
- Dynamic slot generation logic
- Preventing time conflicts
- Structuring relational MongoDB models
- REST API design for real-world scenarios
- React state synchronization with backend
- Route-based navigation
- Debugging module resolution and hook errors
- Structuring scalable full-stack architecture

This project demonstrates growth from CRUD-based APIs to time-based logic systems with real-world applicability.

## Challenges Faced & Solutions
- Slot conflict detection
    Implemented time overlap validation to prevent double bookings.

- Dynamic slot generation
    Built utility function to generate slots without storing them.

- React hook misuse
    Resolved invalid hook call by ensuring correct component structure.

- Vite module resolution issues
    Fixed incorrect project structure by moving services folder inside src.

- Layout alignment
    Implemented centered layout using flexbox for consistent UI positioning.

## Author
Aurora Pantaleo  
Junior Full-stack development portfolio project – 2026