package com.airline.controller;

import com.airline.dto.RegisterRequest;
import com.airline.entity.User;
import com.airline.entity.Airport;
import com.airline.entity.Flight;
import com.airline.entity.Booking;
import com.airline.service.AuthService;
import com.airline.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final AdminService adminService;
    private final AuthService authService;
    
    public AdminController(AdminService adminService, AuthService authService) {
        this.adminService = adminService;
        this.authService = authService;
    }
    
    // Create Admin User
    @PostMapping("/create-admin")
    public ResponseEntity<?> createAdmin(@RequestBody RegisterRequest request) {
        try {
            return ResponseEntity.ok(authService.createAdmin(request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating admin: " + e.getMessage());
        }
    }
    
    // User Management
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }
    
    @PutMapping("/users/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        return ResponseEntity.ok(adminService.updateUser(id, user));
    }
    
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok().build();
    }
    
    @PutMapping("/users/{id}/toggle-lock")
    public ResponseEntity<User> toggleUserLock(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.toggleUserLock(id));
    }
    
    // Airport Management
    @GetMapping("/airports")
    public ResponseEntity<List<Airport>> getAllAirports() {
        return ResponseEntity.ok(adminService.getAllAirports());
    }
    
    @PostMapping("/airports")
    public ResponseEntity<Airport> createAirport(@RequestBody Airport airport) {
        return ResponseEntity.ok(adminService.createAirport(airport));
    }
    
    @PutMapping("/airports/{id}")
    public ResponseEntity<Airport> updateAirport(@PathVariable Long id, @RequestBody Airport airport) {
        return ResponseEntity.ok(adminService.updateAirport(id, airport));
    }
    
    @DeleteMapping("/airports/{id}")
    public ResponseEntity<Void> deleteAirport(@PathVariable Long id) {
        adminService.deleteAirport(id);
        return ResponseEntity.ok().build();
    }
    
    // Flight Management
    @GetMapping("/flights")
    public ResponseEntity<List<Flight>> getAllFlights() {
        return ResponseEntity.ok(adminService.getAllFlights());
    }
    
    @PostMapping("/flights")
    public ResponseEntity<Flight> createFlight(@RequestBody Flight flight) {
        return ResponseEntity.ok(adminService.createFlight(flight));
    }
    
    @PutMapping("/flights/{id}")
    public ResponseEntity<Flight> updateFlight(@PathVariable Long id, @RequestBody Flight flight) {
        return ResponseEntity.ok(adminService.updateFlight(id, flight));
    }
    
    @DeleteMapping("/flights/{id}")
    public ResponseEntity<Void> deleteFlight(@PathVariable Long id) {
        adminService.deleteFlight(id);
        return ResponseEntity.ok().build();
    }
    
    // Booking Management
    @GetMapping("/bookings")
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(adminService.getAllBookings());
    }
    
    @DeleteMapping("/bookings/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable Long id) {
        adminService.deleteBooking(id);
        return ResponseEntity.ok().build();
    }
}