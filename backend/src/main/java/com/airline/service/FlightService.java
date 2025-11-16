package com.airline.service;

import com.airline.entity.Flight;
import com.airline.repository.FlightRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class FlightService {
    private final FlightRepository flightRepository;
    
    public FlightService(FlightRepository flightRepository) {
        this.flightRepository = flightRepository;
    }
    
    public List<Flight> searchFlights(String source, String destination, String date) {
        LocalDateTime searchDate = LocalDateTime.parse(date + "T00:00:00");
        return flightRepository.searchFlights(source, destination, searchDate);
    }
    
    public List<Flight> flexibleSearch(String flightNumber, String source, String destination, String date) {
        LocalDateTime searchDate = null;
        if (date != null && !date.isEmpty()) {
            searchDate = LocalDateTime.parse(date + "T00:00:00");
        }
        
        String flightNum = (flightNumber != null && flightNumber.isEmpty()) ? null : flightNumber;
        String sourceCode = (source != null && source.isEmpty()) ? null : source;
        String destCode = (destination != null && destination.isEmpty()) ? null : destination;
        
        return flightRepository.flexibleSearch(flightNum, sourceCode, destCode, searchDate);
    }
    
    public List<Flight> getAllFlights() {
        return flightRepository.findAll();
    }
    
    public Flight getFlightById(Long id) {
        return flightRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Flight not found"));
    }
    
    public Flight updateFlight(Long id, Flight flight) {
        Flight existing = getFlightById(id);
        existing.setDepartureTime(flight.getDepartureTime());
        existing.setArrivalTime(flight.getArrivalTime());
        existing.setPrice(flight.getPrice());
        existing.setTotalSeats(flight.getTotalSeats());
        existing.setAvailableSeats(flight.getAvailableSeats());
        return flightRepository.save(existing);
    }
}
