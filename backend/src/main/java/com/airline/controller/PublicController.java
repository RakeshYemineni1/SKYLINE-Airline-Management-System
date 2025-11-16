package com.airline.controller;

import com.airline.dto.FlightSearchRequest;
import com.airline.entity.Flight;
import com.airline.entity.Airport;
import com.airline.service.FlightService;
import com.airline.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/public")
public class PublicController {
    private final FlightService flightService;
    private final AdminService adminService;
    
    public PublicController(FlightService flightService, AdminService adminService) {
        this.flightService = flightService;
        this.adminService = adminService;
    }
    
    @PostMapping("/flights/search")
    public ResponseEntity<List<Flight>> searchFlights(@RequestBody FlightSearchRequest request) {
        return ResponseEntity.ok(flightService.searchFlights(request.getSource(), request.getDestination(), request.getDate()));
    }
    
    @PostMapping("/flights/flexible-search")
    public ResponseEntity<List<Flight>> flexibleSearch(@RequestBody FlightSearchRequest request) {
        return ResponseEntity.ok(flightService.flexibleSearch(
            request.getFlightNumber(), 
            request.getSource(), 
            request.getDestination(), 
            request.getDate()
        ));
    }
    
    @GetMapping("/flights/{id}")
    public ResponseEntity<Flight> getFlightById(@PathVariable Long id) {
        return ResponseEntity.ok(flightService.getFlightById(id));
    }
    
    @GetMapping("/airports")
    public ResponseEntity<List<Airport>> getAllAirports() {
        return ResponseEntity.ok(adminService.getAllAirports());
    }
    
    @GetMapping("/flights")
    public ResponseEntity<List<Flight>> getAllFlights() {
        return ResponseEntity.ok(flightService.getAllFlights());
    }
}