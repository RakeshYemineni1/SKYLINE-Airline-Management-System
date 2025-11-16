-- Create Database
CREATE DATABASE IF NOT EXISTS airline_db;
USE airline_db;

-- Sample Airports
INSERT INTO airports (code, name, city, country) VALUES
('JFK', 'John F. Kennedy International Airport', 'New York', 'USA'),
('LAX', 'Los Angeles International Airport', 'Los Angeles', 'USA'),
('ORD', 'O Hare International Airport', 'Chicago', 'USA'),
('LHR', 'London Heathrow Airport', 'London', 'UK'),
('DXB', 'Dubai International Airport', 'Dubai', 'UAE'),
('SFO', 'San Francisco International Airport', 'San Francisco', 'USA'),
('MIA', 'Miami International Airport', 'Miami', 'USA'),
('BOS', 'Boston Logan International Airport', 'Boston', 'USA');

-- Sample Flights (Update dates as needed)
INSERT INTO flights (flight_number, source_airport_id, destination_airport_id, 
                     departure_time, arrival_time, total_seats, available_seats, price, airline)
VALUES 
('AA101', 1, 2, '2024-12-25 08:00:00', '2024-12-25 11:00:00', 180, 180, 299.99, 'American Airlines'),
('UA202', 2, 3, '2024-12-25 14:00:00', '2024-12-25 16:30:00', 150, 150, 199.99, 'United Airlines'),
('BA303', 1, 4, '2024-12-26 18:00:00', '2024-12-27 06:00:00', 200, 200, 599.99, 'British Airways'),
('EK404', 1, 5, '2024-12-27 22:00:00', '2024-12-28 18:00:00', 300, 300, 899.99, 'Emirates'),
('DL505', 6, 7, '2024-12-28 10:00:00', '2024-12-28 15:30:00', 160, 160, 349.99, 'Delta Airlines'),
('AA606', 8, 1, '2024-12-29 07:00:00', '2024-12-29 08:30:00', 140, 140, 149.99, 'American Airlines');

-- Create Admin User
-- Note: Password is 'admin123' (hashed with BCrypt)
-- You should register a user first via the API, then update their role to ADMIN
-- Or use this SQL after the tables are created:
-- INSERT INTO users (email, password, first_name, last_name, phone_number, role, locked, created_at)
-- VALUES ('admin@airline.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 
--         'Admin', 'User', '1234567890', 'ADMIN', false, NOW());
