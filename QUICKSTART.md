# Quick Start Guide

## Step 1: Install Prerequisites

- Java 17+
- Node.js 16+
- MySQL 8.0+
- Maven 3.6+

## Step 2: Setup MySQL Database

```bash
mysql -u root -p
```

```sql
CREATE DATABASE airline_db;
exit;
```

## Step 3: Configure Database (Optional)

If your MySQL credentials are different, update:
`backend/src/main/resources/application.properties`

```properties
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD
```

## Step 4: Start Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Wait for: "Started AirlineApplication in X seconds"

## Step 5: Start Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm start
```

Browser will open at `http://localhost:3000`

## Step 6: Add Sample Data

### Option A: Using SQL Script

```bash
mysql -u root -p airline_db < database-init.sql
```

### Option B: Manual via Application

1. Register a user at `http://localhost:3000/register`
2. Login to MySQL and update user role to ADMIN:

```sql
USE airline_db;
UPDATE users SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```

3. Logout and login again
4. Add airports via Admin panel
5. Add flights via database (or create admin UI for it)

## Step 7: Test the Application

### As Public User:
1. Go to homepage
2. Search flights (e.g., JFK to LAX)
3. Select a flight
4. Enter traveler details
5. Login/Register
6. Complete payment (use any card number like 1234567890123456)
7. Download ticket

### As Admin:
1. Login with admin credentials
2. Navigate to admin sections
3. Manage users, airports, flights, bookings

## Common Issues

**Backend won't start:**
- Check if MySQL is running
- Verify database credentials
- Ensure port 8080 is free

**Frontend won't start:**
- Delete `node_modules` and run `npm install` again
- Ensure port 3000 is free

**Can't login:**
- Check if backend is running
- Check browser console for errors
- Verify user exists in database

**No flights showing:**
- Add sample data using database-init.sql
- Update flight dates to future dates

## Default Test Credentials

After creating admin user:
- Email: admin@airline.com
- Password: admin123

## API Testing with Postman/cURL

### Register User:
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "1234567890"
  }'
```

### Login:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Search Flights:
```bash
curl -X POST http://localhost:8080/api/public/flights/search \
  -H "Content-Type: application/json" \
  -d '{
    "source": "JFK",
    "destination": "LAX",
    "date": "2024-12-25"
  }'
```

## Next Steps

1. Customize the UI styling
2. Add more validation
3. Implement real payment gateway
4. Add email notifications
5. Add flight creation UI for admin
6. Add seat selection feature
7. Add flight status tracking

Enjoy building your Airline Registration System! 🛫
