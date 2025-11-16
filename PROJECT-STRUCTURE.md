# Project Structure

```
airline-registration-system/
│
├── backend/                          # Spring Boot Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/airline/
│   │   │   │   ├── AirlineApplication.java      # Main application class
│   │   │   │   ├── config/
│   │   │   │   │   └── SecurityConfig.java      # Security & CORS configuration
│   │   │   │   ├── controller/
│   │   │   │   │   ├── AuthController.java      # Login/Register endpoints
│   │   │   │   │   ├── PublicController.java    # Public flight search
│   │   │   │   │   ├── CustomerController.java  # Customer booking endpoints
│   │   │   │   │   └── AdminController.java     # Admin management endpoints
│   │   │   │   ├── dto/
│   │   │   │   │   ├── LoginRequest.java
│   │   │   │   │   ├── RegisterRequest.java
│   │   │   │   │   ├── BookingRequest.java
│   │   │   │   │   └── FlightSearchRequest.java
│   │   │   │   ├── entity/
│   │   │   │   │   ├── User.java               # User entity with roles
│   │   │   │   │   ├── Airport.java            # Airport entity
│   │   │   │   │   ├── Flight.java             # Flight entity
│   │   │   │   │   └── Booking.java            # Booking entity
│   │   │   │   ├── repository/
│   │   │   │   │   ├── UserRepository.java
│   │   │   │   │   ├── AirportRepository.java
│   │   │   │   │   ├── FlightRepository.java
│   │   │   │   │   └── BookingRepository.java
│   │   │   │   ├── security/
│   │   │   │   │   ├── JwtUtil.java            # JWT token generation/validation
│   │   │   │   │   └── JwtAuthFilter.java      # JWT authentication filter
│   │   │   │   └── service/
│   │   │   │       ├── AuthService.java        # Authentication logic
│   │   │   │       ├── FlightService.java      # Flight operations
│   │   │   │       ├── BookingService.java     # Booking operations
│   │   │   │       ├── PdfService.java         # PDF ticket generation
│   │   │   │       └── AdminService.java       # Admin operations
│   │   │   └── resources/
│   │   │       └── application.properties      # Database & app configuration
│   │   └── test/                               # Test files
│   ├── pom.xml                                 # Maven dependencies
│   └── .gitignore
│
├── frontend/                         # React Frontend
│   ├── public/
│   │   └── index.html                          # HTML template
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.js                       # Navigation bar component
│   │   ├── pages/
│   │   │   ├── Home.js                         # Flight search page
│   │   │   ├── Login.js                        # Login page
│   │   │   ├── Register.js                     # Registration page
│   │   │   ├── Booking.js                      # Booking flow page
│   │   │   ├── MyBookings.js                   # Customer bookings page
│   │   │   ├── AdminUsers.js                   # Admin user management
│   │   │   ├── AdminAirports.js                # Admin airport management
│   │   │   ├── AdminFlights.js                 # Admin flight management
│   │   │   └── AdminBookings.js                # Admin booking management
│   │   ├── services/
│   │   │   └── api.js                          # API service with axios
│   │   ├── utils/
│   │   │   └── auth.js                         # Authentication utilities
│   │   ├── App.js                              # Main app with routing
│   │   ├── index.js                            # React entry point
│   │   └── index.css                           # Global styles
│   ├── package.json                            # NPM dependencies
│   └── .gitignore
│
├── database-init.sql                 # Sample data SQL script
├── README.md                         # Comprehensive documentation
├── QUICKSTART.md                     # Quick setup guide
└── PROJECT-STRUCTURE.md              # This file

```

## Key Components

### Backend Architecture

**Controllers** (REST API Layer)
- Handle HTTP requests/responses
- Route to appropriate services
- Apply security annotations

**Services** (Business Logic Layer)
- Implement business rules
- Handle transactions
- Coordinate between repositories

**Repositories** (Data Access Layer)
- JPA interfaces for database operations
- Custom queries for complex operations

**Entities** (Data Models)
- JPA entities mapped to database tables
- Relationships defined with annotations

**Security**
- JWT-based authentication
- Role-based access control (RBAC)
- Password encryption with BCrypt

### Frontend Architecture

**Pages**
- Full page components
- Handle routing and layout
- Manage page-level state

**Components**
- Reusable UI components
- Shared across pages

**Services**
- API communication with backend
- Axios interceptors for auth tokens

**Utils**
- Helper functions
- Authentication state management

### Database Schema

**users**
- id, email, password, firstName, lastName, phoneNumber, role, locked, createdAt

**airports**
- id, code, name, city, country

**flights**
- id, flightNumber, sourceAirportId, destinationAirportId, departureTime, arrivalTime, totalSeats, availableSeats, price, airline

**bookings**
- id, bookingReference, userId, flightId, passengerName, passengerEmail, passengerPhone, passportNumber, numberOfSeats, totalAmount, paymentStatus, cardLastFourDigits, bookingDate

## Technology Stack

### Backend
- **Framework**: Spring Boot 3.2.0
- **Security**: Spring Security + JWT
- **Database**: MySQL 8.0
- **ORM**: Spring Data JPA / Hibernate
- **PDF**: iText 5.5.13
- **Build Tool**: Maven

### Frontend
- **Library**: React 18
- **Routing**: React Router 6
- **HTTP Client**: Axios
- **Styling**: Pure CSS3

## API Endpoints Summary

### Public (No Auth Required)
- POST `/api/auth/register` - Register
- POST `/api/auth/login` - Login
- POST `/api/public/flights/search` - Search flights
- GET `/api/public/flights/{id}` - Get flight

### Customer (Auth Required)
- POST `/api/customer/bookings` - Create booking
- GET `/api/customer/bookings` - Get my bookings
- GET `/api/customer/bookings/{id}/ticket` - Download ticket

### Admin (Admin Role Required)
- GET/PUT/DELETE `/api/admin/users/*` - User management
- GET/POST/PUT/DELETE `/api/admin/airports/*` - Airport management
- GET/PUT `/api/admin/flights/*` - Flight management
- GET/DELETE `/api/admin/bookings/*` - Booking management

## Security Features

1. **Password Encryption**: BCrypt hashing
2. **JWT Authentication**: Stateless token-based auth
3. **Role-Based Access**: CUSTOMER and ADMIN roles
4. **CORS Configuration**: Configured for React frontend
5. **Account Locking**: Admin can lock/unlock users
6. **Secure Endpoints**: Protected by Spring Security

## Features Implemented

✅ Public flight search
✅ User registration and authentication
✅ Role-based access control
✅ Flight booking with payment
✅ PDF ticket generation
✅ Booking history
✅ Admin user management
✅ Admin airport management
✅ Admin flight management
✅ Admin booking management
✅ Account lock/unlock
✅ Responsive UI

## Future Enhancements

- Real payment gateway integration
- Email notifications
- Seat selection UI
- Flight status tracking
- Multi-city flights
- Round-trip bookings
- Loyalty program
- Reviews and ratings
- Mobile app
