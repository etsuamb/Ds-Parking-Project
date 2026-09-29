# Distributed Smart Parking Booking System

A distributed smart-parking platform built with a **microservices architecture**. Users can view parking availability, reserve spots, manage bookings, and receive booking-related notifications.

## Overview

The system demonstrates how multiple independent services can work together through an API gateway and asynchronous event communication.

## Key Features

### User
- Registration and JWT authentication
- Browse parking lots and available spots
- Create and cancel bookings
- View booking history

### Admin
- Role-based authorization
- Manage parking lots and parking spots
- View and manage bookings
- Administrative booking controls

## Architecture

```text
React + Vite Frontend
        |
   API Gateway
        |
 ┌──────┼────────┬──────────────┐
 Auth  Booking  Parking     Notification
   |      |        |              |
   └──────┴────────┴────── Redis ─┘
                 |
             PostgreSQL
```

### Services

| Component | Responsibility |
|---|---|
| API Gateway | Routes requests to backend services |
| Auth Service | Authentication, JWT, and roles |
| Booking Service | Reservations and booking workflows |
| Parking Service | Parking lots and spot management |
| Notification Service | Booking-related notifications |
| Redis | Asynchronous event communication |
| PostgreSQL | Persistent service data |

## Communication

- **REST APIs** for synchronous user operations
- **Redis Pub/Sub** for asynchronous events and state updates

## Technology Stack

- React + Vite
- Tailwind CSS
- Axios
- Node.js
- Express.js
- PostgreSQL
- Redis
- Docker / Docker Compose
- JWT

## Running the Project

### Prerequisites

- Docker
- Docker Compose

### Start

```bash
docker compose up --build
```

### Stop

```bash
docker compose down
```

## Project Structure

The repository contains the frontend, API gateway, authentication, booking, parking, and notification services, with Docker configuration for running the stack together.

## Project Type

Distributed systems / microservices project.
