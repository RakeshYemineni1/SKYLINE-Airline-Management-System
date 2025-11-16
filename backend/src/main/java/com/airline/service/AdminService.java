package com.airline.service;

import com.airline.entity.Airport;
import com.airline.entity.User;
import com.airline.entity.Flight;
import com.airline.entity.Booking;
import com.airline.repository.AirportRepository;
import com.airline.repository.UserRepository;
import com.airline.repository.FlightRepository;
import com.airline.repository.BookingRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AdminService {
    private final UserRepository userRepository;
    private final AirportRepository airportRepository;
    private final FlightRepository flightRepository;
    private final BookingRepository bookingRepository;
    
    public AdminService(UserRepository userRepository, AirportRepository airportRepository, 
                       FlightRepository flightRepository, BookingRepository bookingRepository) {
        this.userRepository = userRepository;
        this.airportRepository = airportRepository;
        this.flightRepository = flightRepository;
        this.bookingRepository = bookingRepository;
    }
    
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    public User updateUser(Long id, User user) {
        User existing = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        existing.setFirstName(user.getFirstName());
        existing.setLastName(user.getLastName());
        existing.setPhoneNumber(user.getPhoneNumber());
        return userRepository.save(existing);
    }
    
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
    
    public User toggleUserLock(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setLocked(!user.isLocked());
        return userRepository.save(user);
    }
    
    public Airport createAirport(Airport airport) {
        return airportRepository.save(airport);
    }
    
    public Airport updateAirport(Long id, Airport airport) {
        Airport existing = airportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Airport not found"));
        existing.setCode(airport.getCode());
        existing.setName(airport.getName());
        existing.setCity(airport.getCity());
        existing.setCountry(airport.getCountry());
        return airportRepository.save(existing);
    }
    
    public void deleteAirport(Long id) {
        airportRepository.deleteById(id);
    }
    
    public List<Airport> getAllAirports() {
        return airportRepository.findAll();
    }
    
    // Flight Management
    public List<Flight> getAllFlights() {
        return flightRepository.findAll();
    }
    
    public Flight createFlight(Flight flight) {
        Airport sourceAirport = airportRepository.findById(flight.getSourceAirport().getId())
                .orElseThrow(() -> new RuntimeException("Source airport not found"));
        Airport destinationAirport = airportRepository.findById(flight.getDestinationAirport().getId())
                .orElseThrow(() -> new RuntimeException("Destination airport not found"));
        
        flight.setSourceAirport(sourceAirport);
        flight.setDestinationAirport(destinationAirport);
        return flightRepository.save(flight);
    }
    
    public Flight updateFlight(Long id, Flight flight) {
        Flight existing = flightRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Flight not found"));
        existing.setFlightNumber(flight.getFlightNumber());
        existing.setAirline(flight.getAirline());
        existing.setDepartureTime(flight.getDepartureTime());
        existing.setArrivalTime(flight.getArrivalTime());
        existing.setPrice(flight.getPrice());
        return flightRepository.save(existing);
    }
    
    public void deleteFlight(Long id) {
        flightRepository.deleteById(id);
    }
    
    // Booking Management
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }
    
    public void deleteBooking(Long id) {
        bookingRepository.deleteById(id);
    }
}
