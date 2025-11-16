package com.airline.repository;

import com.airline.entity.Flight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDateTime;
import java.util.List;

public interface FlightRepository extends JpaRepository<Flight, Long> {
    @Query("SELECT f FROM Flight f WHERE f.sourceAirport.code = :source " +
           "AND f.destinationAirport.code = :destination " +
           "AND DATE(f.departureTime) = DATE(:date) " +
           "AND f.availableSeats > 0")
    List<Flight> searchFlights(String source, String destination, LocalDateTime date);
    
    @Query("SELECT f FROM Flight f WHERE " +
           "(:flightNumber IS NULL OR f.flightNumber LIKE %:flightNumber%) " +
           "AND (:source IS NULL OR f.sourceAirport.code = :source) " +
           "AND (:destination IS NULL OR f.destinationAirport.code = :destination) " +
           "AND (:date IS NULL OR DATE(f.departureTime) = DATE(:date)) " +
           "AND f.availableSeats > 0")
    List<Flight> flexibleSearch(String flightNumber, String source, String destination, LocalDateTime date);
    
    @Query("SELECT f FROM Flight f WHERE f.flightNumber LIKE %:flightNumber% AND f.availableSeats > 0")
    List<Flight> searchByFlightNumber(String flightNumber);
    
    @Query("SELECT f FROM Flight f WHERE DATE(f.departureTime) = DATE(:date) AND f.availableSeats > 0")
    List<Flight> searchByDate(LocalDateTime date);
}
