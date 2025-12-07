# 🚗 Vehicle Rental System

**Live URL:** *(Add your live deployment URL here)*

A backend API for a Vehicle Rental Management System, built to manage vehicles, customers, and bookings efficiently with role-based authentication and business rules enforcement.

---

## 🎯 Features

- **Vehicles Management**  
  - Add, update, delete, and retrieve vehicles  
  - Track vehicle availability status (`available` or `booked`)  
- **Customer Management**  
  - Register and manage customer accounts  
  - Role-based access (`admin` vs `customer`)  
- **Booking Management**  
  - Create bookings with automatic price calculation  
  - Cancel bookings (customer) or mark as returned (admin)  
  - Auto-return bookings when rental period ends  
- **Authentication & Authorization**  
  - JWT-based authentication  
  - Passwords hashed with bcrypt  
  - Role-based access control for endpoints  

---

## 🛠️ Technology Stack

- **Backend:** Node.js + TypeScript  
- **Framework:** Express.js  
- **Database:** PostgreSQL  
- **Authentication:** JSON Web Tokens (JWT)  
- **Password Security:** bcrypt  
- **Development Tools:** Nodemon, ESLint, Prettier  

---

## 📁 Codebase Structure

src/
├─ config/
│ ├─ db.ts # Database connection
│ └─ index.ts # Environment & configuration
├─ modules/
│ ├─ auth/
│ │ ├─ auth.controller.ts
│ │ ├─ auth.routes.ts
│ │ └─ auth.service.ts
│ ├─ users/
│ │ ├─ users.controller.ts
│ │ ├─ users.routes.ts
│ │ └─ users.service.ts
│ ├─ vehicles/
│ │ ├─ vehicles.controller.ts
│ │ ├─ vehicles.routes.ts
│ │ └─ vehicles.service.ts
│ └─ bookings/
│ ├─ bookings.controller.ts
│ ├─ bookings.routes.ts
│ └─ bookings.service.ts
├─ middleware/
│ ├─ auth.ts # JWT verification & role checks
├─ app.ts # Express app setup
└─ server.ts # Server initialization

---

## ⚡ API Endpoints Overview

### Authentication
- **POST /api/v1/auth/signup** – Register user  
- **POST /api/v1/auth/signin** – Login and receive JWT token  

### Vehicles
- **POST /api/v1/vehicles** – Add vehicle (Admin)  
- **GET /api/v1/vehicles** – List all vehicles  
- **GET /api/v1/vehicles/:vehicleId** – Vehicle details  
- **PUT /api/v1/vehicles/:vehicleId** – Update vehicle (Admin)  
- **DELETE /api/v1/vehicles/:vehicleId** – Delete vehicle (Admin, no active bookings)  

### Users
- **GET /api/v1/users** – List all users (Admin)  
- **PUT /api/v1/users/:userId** – Update user (Admin or own profile)  
- **DELETE /api/v1/users/:userId** – Delete user (Admin, no active bookings)  

### Bookings
- **POST /api/v1/bookings** – Create booking (Customer/Admin)  
- **GET /api/v1/bookings** – List bookings (role-based)  
- **PUT /api/v1/bookings/:bookingId** – Update status: cancel (Customer), return (Admin)  

---

## 📝 Setup & Usage Instructions

### Prerequisites
- Node.js >= 18  
- PostgreSQL >= 12  
- npm or yarn  

### Installation
1. Clone the repository
```bash
git clone https://github.com/habibchy947/CarvaCore
cd vehicle-rental-system
