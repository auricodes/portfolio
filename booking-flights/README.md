## Booking-flights – MERN Stack Application

## Overview
Booking-Flights is a full-stack flight booking simulation built using the MERN stack (MongoDB, Express.js, React, Node.js).

The application allows users to search for flights, view detailed flight information, select passengers, customize travel options, simulate payment, and generate digital boarding passes.

The main focus of this project is user experience design, combined with full-stack architecture and structured API communication.

Compared to the other projects in this portfolio, Booking-Flights places a stronger emphasis on UI flow, interaction design, and a realistic booking journey, while still maintaining a clean backend architecture and REST API structure.

This project represents the fourth and most complete application in a four-project portfolio demonstrating progressive complexity in full-stack development.

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
booking-flights/
 ├── server/
 └── client/
```
Backend Structure
```
server/
├── models/
│   └── booking.js
│
├── routes/
│   ├── flights.js.js
│   ├── bookings.js
│
├── data/
│   └── flights.js
│
├── server.js
├── package.json
└── .env (not included in repository)
```    
The backend follows REST API principles and provides endpoints for retrieving flight data and handling booking operations.
Environment variables are handled through a local .env file which is not included in the repository.

## Backend Features
- Flight Data Simulation
    Flights are provided through a predefined dataset containing realistic flight information including:
    - departure city
    - arrival city
    - airport codes
    - departure and arrival times
    - ticket price
    - available seats

    Each flight object includes:

    id
    from
    fromAirportCode
    to
    toAirportCode
    departureTime
    arrivalTime
    price
    seatsAvailable

This structure simulates a simplified airline inventory system.

- Booking Model
    Bookings are stored in MongoDB using Mongoose.
    Each booking includes:
    - flight reference
    - passenger details
    - total price
    - booking status

    Example fields:

    flight
    passengers
    totalPrice
    status

Status can be:

    pending
    paid

This structure models a simplified flight reservation system.

## API Endpoints

Flights

GET /api/flights
GET /api/flights/:id

Bookings

POST /api/bookings
GET /api/bookings

These endpoints allow the frontend to retrieve available flights and create booking records.

## Frontend Features

The frontend focuses strongly on user experience and booking flow simulation.
Key features include:
- Landing page with fullscreen video background
- Search interface for flights
- Interactive flight selection
- Detailed flight information page
- Passenger information form
- Optional add-ons:
    - checked baggage
    - child passenger
    - pet travel
    - seat selection

- Interactive seat selection interface
- Simulated payment system
- Digital boarding pass generation
- Individual tickets for each passenger
- Ticket generation for child or pet travel
- Barcode generation for digital tickets
- Dynamic background videos depending on destination
- Smooth navigation using React Router
- Responsive centered UI layout
- The frontend communicates with the backend using Axios.

## UI / UX Focus

This project emphasizes a realistic airline booking experience.
User experience elements include:
- cinematic landing page
- dynamic video backgrounds
-  centered UI layout
- clear booking progression
- interactive seat map selection
- structured travel options
- digital ticket visualization
- multiple ticket generation per passenger

The goal was to simulate the full journey of booking a flight online, from search to boarding pass.

## Dynamic Background System

Background videos change dynamically depending on the selected destination.

Examples:

London → london.mp4
Paris → paris.mp4
Barcelona → barcelona.mp4
Berlin → berlin.mp4
New York → newyork.mp4
Amsterdam → amsterdam.mp4

During booking steps, the background reflects the destination city to enhance immersion.
After confirmation, the system returns to the default background.

## Database Design
Booking Schema
    flight (Object reference)
    passengers
    totalPrice
    status
    timestamps

Passenger information includes:

    firstName
    lastName
    selectedSeat

Optional travel data may include:

    childPassenger
    petTravel
    checkedBaggage

## How to Run the Project
- Backend
    cd server
    npm install
    npm run dev

Create a .env file containing:
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

Server runs on:
http://localhost:5003

- Frontend
    cd client
    npm install
    npm run dev

Frontend runs on:
http://localhost:5173

## Learning Focus

This project focuses on:
- Building a full booking workflow
- Designing a user-centered interface
- Managing application state across multiple steps
- Integrating frontend navigation with backend data
- Structuring a full MERN application
- Handling multi-passenger booking logic
- Implementing seat selection systems
- Designing digital ticket interfaces
- Working with dynamic background assets
- Improving UI/UX design for full-stack applications
This project demonstrates progression from simple CRUD applications to interactive full-stack systems with complex user flows.

## Challenges Faced & Solutions
- Multi-step booking state
    Managing passenger information, add-ons, and seat selection across multiple pages required careful state handling and navigation logic.

- Dynamic UI updates
    Conditional rendering was implemented to display optional travel features such as pets, children, and baggage.

- Video background management
    Background videos were dynamically controlled based on route and flight selection.

- Layout alignment
    Flexbox was used extensively to center and align UI components across different screen sizes.

- Booking flow simulation
    A realistic airline booking process was modeled through multiple sequential UI steps.

## Author

Aurora Pantaleo
Junior Full-Stack Developer Portfolio Project – 2026
