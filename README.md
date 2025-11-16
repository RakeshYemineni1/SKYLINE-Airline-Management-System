# SKYLINE Airline Management System

A full-stack airline booking system built with Spring Boot, React, and MySQL. This system allows users to search flights, make bookings, and provides comprehensive admin management capabilities.

## Features

### Public Users
- Search flights by source, destination, and date
- View all available flights
- View flight details and pricing
- User registration and authentication

### Customer Users
- All public features
- Secure login with JWT authentication
- Book flights with passenger details
- Make payments via Credit/Debit card (simulated)
- Download tickets as PDF
- View booking history
- Manage profile information

### Admin Users
- Complete user management (add/update/delete/lock/unlock)
- Airport management (add/update/delete airports)
- Flight management (add/update/delete flights)
- Booking management (view/delete bookings)
- Dashboard with system statistics
- View all ticket booking history

## Tech Stack

### Backend
- **Java 17** - Programming language
- **Spring Boot 3.2.0** - Application framework
- **Spring Security** - Authentication and authorization with JWT
- **Spring Data JPA** - Database operations
- **MySQL 8.0** - Database
- **iText PDF** - Ticket generation
- **BCrypt** - Password encryption

### Frontend
- **React 18** - UI framework
- **React Router** - Navigation
- **Axios** - HTTP client
- **CSS3** - Styling
- **Theme Context** - Dark/Light mode support

## Prerequisites

Before running this project, ensure you have:

- **Java 17** or higher
- **Node.js 16** or higher
- **MySQL 8.0** or higher
- **Maven 3.6** or higher

## Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/RakeshYemineni1/SKYLINE-Airline-Management-System.git
cd SKYLINE-Airline-Management-System
```

### 2. Database Setup
```sql
CREATE DATABASE airline_db;
```

### 3. Configure Database
Update `backend/src/main/resources/application.properties`:
```properties
spring.datasource.username=your_mysql_username
spring.datasource.password=your_mysql_password
```

### 4. Backend Setup
```bash
cd backend
mvn clean install
mvn spring-boot:run
```
Backend runs on `http://localhost:8080`

**Swagger UI:** Access API documentation at `http://localhost:8080/swagger-ui.html`

## Swagger UI Testing Guide

### 1. Public API Testing (No Authentication Required)

#### Test User Registration:
1. Go to **auth-controller** → **POST /api/auth/register**
2. Click "Try it out"
3. Use this sample data:
```json
{
  "email": "test@example.com",
  "password": "password123",
  "firstName": "Test",
  "lastName": "User",
  "phoneNumber": "1234567890"
}
```
4. Click "Execute" - Should return 200 with user details and JWT token

#### Test User Login:
1. Go to **auth-controller** → **POST /api/auth/login**
2. Use credentials:
```json
{
  "email": "admin@airline.com",
  "password": "admin123"
}
```
3. **Copy the JWT token** from response for authenticated requests

#### Test Public Flight APIs:
1. **GET /api/public/flights** - View all flights
2. **GET /api/public/airports** - View all airports
3. **POST /api/public/flights/search** - Search flights:
```json
{
  "source": "JFK",
  "destination": "LAX",
  "date": "2025-12-25"
}
```

### 2. Authenticated API Testing

#### Setup Authentication:
1. Click the **"Authorize"** button (🔒 icon) at the top
2. Enter: `Bearer YOUR_JWT_TOKEN_HERE`
3. Click "Authorize"

#### Test Customer APIs:
1. **GET /api/customer/bookings** - View user bookings
2. **POST /api/customer/bookings** - Create booking:
```json
{
  "flightId": 1,
  "passengerName": "John Doe",
  "passengerEmail": "john@example.com",
  "passengerPhone": "1234567890",
  "numberOfSeats": 1,
  "cardNumber": "4111111111111111",
  "expiryDate": "12/25",
  "cvv": "123",
  "cardHolderName": "John Doe"
}
```

#### Test Admin APIs (Use admin JWT token):
1. **GET /api/admin/users** - View all users
2. **POST /api/admin/airports** - Create airport:
```json
{
  "code": "TEST",
  "name": "Test Airport",
  "city": "Test City",
  "country": "Test Country"
}
```
3. **POST /api/admin/flights** - Create flight:
```json
{
  "flightNumber": "TEST123",
  "airline": "Test Airlines",
  "sourceAirport": {"id": 1},
  "destinationAirport": {"id": 2},
  "departureTime": "2025-12-25T10:00:00",
  "arrivalTime": "2025-12-25T14:00:00",
  "totalSeats": 180,
  "availableSeats": 180,
  "price": 299.99
}
```

### 3. Common Testing Scenarios

#### Complete Booking Flow:
1. Register/Login as customer
2. Search for flights
3. Get flight details by ID
4. Create booking
5. View bookings
6. Download ticket (returns PDF)

#### Admin Management Flow:
1. Login as admin
2. Create airports
3. Create flights
4. View all bookings
5. Manage users (lock/unlock)

### 4. Testing Tips

- **Authentication Errors (401)**: Check if JWT token is valid and properly formatted
- **Authorization Errors (403)**: Ensure user has correct role (ADMIN/CUSTOMER)
- **Validation Errors (400)**: Check required fields and data formats
- **Not Found (404)**: Verify IDs exist in database

### 5. Sample Test Data

**Valid Airport Codes**: JFK, LAX, ORD, LHR, DXB, SFO, MIA, BOS
**Valid Flight IDs**: Check GET /api/public/flights for current flight IDs
**Date Format**: YYYY-MM-DD (e.g., "2025-12-25")
**DateTime Format**: YYYY-MM-DDTHH:mm:ss (e.g., "2025-12-25T10:00:00")

### 6. Frontend Setup
```bash
cd frontend
npm install
npm start
```
Frontend runs on `http://localhost:3000`

## Sample Accounts

### Admin Account
- **Email:** `admin@airline.com`
- **Password:** `admin123`
- **Access:** Full admin dashboard

### Customer Account
- **Email:** `sample@airline.com`
- **Password:** `admin123`
- **Access:** Customer features

### Developer Account
- **Email:** `rakeshyemineni2005@gmail.com`
- **Role:** ADMIN

## API Endpoints

### Public Endpoints
```
POST /api/auth/register          - Register new user
POST /api/auth/login             - User login
POST /api/public/flights/search  - Search flights
GET  /api/public/flights         - Get all flights
GET  /api/public/flights/{id}    - Get flight details
GET  /api/public/airports        - Get all airports
```

### Customer Endpoints (Requires Authentication)
```
POST /api/customer/bookings           - Create booking
GET  /api/customer/bookings           - Get user bookings
GET  /api/customer/bookings/{id}/ticket - Download ticket PDF
```

### Admin Endpoints (Requires Admin Role)
```
# User Management
GET    /api/admin/users              - Get all users
PUT    /api/admin/users/{id}         - Update user
DELETE /api/admin/users/{id}         - Delete user
PUT    /api/admin/users/{id}/toggle-lock - Lock/Unlock user

# Airport Management
GET    /api/admin/airports           - Get all airports
POST   /api/admin/airports           - Create airport
PUT    /api/admin/airports/{id}      - Update airport
DELETE /api/admin/airports/{id}      - Delete airport

# Flight Management
GET    /api/admin/flights            - Get all flights
POST   /api/admin/flights            - Create flight
PUT    /api/admin/flights/{id}       - Update flight
DELETE /api/admin/flights/{id}       - Delete flight

# Booking Management
GET    /api/admin/bookings           - Get all bookings
DELETE /api/admin/bookings/{id}      - Delete booking
```

## Usage Guide

### For Customers
1. **Registration/Login**
   - Visit the homepage
   - Register a new account or login
   
2. **Search & Book Flights**
   - Use the search form to find flights
   - Select departure/destination cities and date
   - View available flights and select one
   - Enter passenger details
   - Complete payment (simulated)
   - Download your ticket

3. **Manage Bookings**
   - View booking history in "My Bookings"
   - Download tickets anytime
   - Check flight details

### For Admins
1. **Login**
   - Access admin panel at `/admin/login`
   - Use admin credentials

2. **Dashboard Overview**
   - View system statistics
   - Monitor recent bookings
   - Quick access to all management features

3. **Manage System**
   - **Airports:** Add new airports, update existing ones
   - **Flights:** Create flight schedules, update prices/seats
   - **Users:** Manage customer accounts, lock/unlock users
   - **Bookings:** View all bookings, delete if needed

## Configuration

### Database Configuration
```properties
# MySQL Database
spring.datasource.url=jdbc:mysql://localhost:3306/airline_db
spring.datasource.username=root
spring.datasource.password=your_password

# JPA Settings
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

### JWT Configuration
```properties
jwt.secret=your_jwt_secret_key
jwt.expiration=86400000  # 24 hours
```

### Security Features
- **Password Encryption:** BCrypt hashing
- **JWT Authentication:** Secure token-based auth
- **Role-based Access:** Customer/Admin permissions
- **CORS Configuration:** Frontend-backend communication

## Project Structure

```
airline-registration-system/
├── backend/
│   ├── src/main/java/com/airline/
│   │   ├── config/          # Security configuration
│   │   ├── controller/      # REST controllers
│   │   ├── dto/            # Data transfer objects
│   │   ├── entity/         # JPA entities
│   │   ├── repository/     # Data repositories
│   │   ├── security/       # JWT utilities
│   │   └── service/        # Business logic
│   └── src/main/resources/
│       └── application.properties
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/     # Reusable components
│       ├── contexts/       # React contexts
│       ├── pages/          # Page components
│       ├── services/       # API services
│       └── utils/          # Utility functions
└── README.md
```

## Development Notes

- **Database:** Auto-creates tables on first run
- **Payment:** Simulated (no real payment gateway)
- **PDF Generation:** Uses iText library
- **Theme Support:** Dark/Light mode toggle
- **Responsive Design:** Works on desktop and mobile

## Production Deployment

For production deployment:

1. **Update Database Credentials**
   - Use production database settings
   - Enable SSL if required

2. **Security Enhancements**
   - Change JWT secret key
   - Use environment variables for sensitive data
   - Enable HTTPS

3. **Build for Production**
   ```bash
   # Backend
   mvn clean package
   
   # Frontend
   npm run build
   ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Contact

**Developer:** Rakesh Yemineni  
**Email:** rakeshyemineni2005@gmail.com

---

**Note:** This is a demonstration project. For production use, implement proper payment gateways, enhanced security measures, and comprehensive error handling.
