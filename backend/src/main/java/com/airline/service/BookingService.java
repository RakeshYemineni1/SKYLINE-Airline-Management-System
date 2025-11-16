package com.airline.service;

import com.airline.dto.BookingRequest;
import com.airline.entity.Booking;
import com.airline.entity.Flight;
import com.airline.entity.User;
import com.airline.repository.BookingRepository;
import com.airline.repository.FlightRepository;
import com.airline.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.UUID;

@Service
public class BookingService {
    private final BookingRepository bookingRepository;
    private final FlightRepository flightRepository;
    private final UserRepository userRepository;
    
    public BookingService(BookingRepository bookingRepository, FlightRepository flightRepository, 
                         UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.flightRepository = flightRepository;
        this.userRepository = userRepository;
    }
    
    @Transactional
    public Booking createBooking(BookingRequest request, String email) {
        Flight flight = flightRepository.findById(request.getFlightId())
                .orElseThrow(() -> new RuntimeException("Flight not found"));
        
        if (flight.getAvailableSeats() < request.getNumberOfSeats()) {
            throw new RuntimeException("Not enough seats available");
        }
        
        User user = userRepository.findByEmail(email).orElse(null);
        
        Booking booking = new Booking();
        booking.setBookingReference(UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        booking.setUser(user);
        booking.setFlight(flight);
        booking.setPassengerName(request.getPassengerName());
        booking.setPassengerEmail(request.getPassengerEmail());
        booking.setPassengerPhone(request.getPassengerPhone());
        booking.setPassportNumber(request.getPassportNumber());
        booking.setNumberOfSeats(request.getNumberOfSeats());
        booking.setTotalAmount(flight.getPrice() * request.getNumberOfSeats());
        booking.setPaymentStatus(Booking.PaymentStatus.COMPLETED);
        booking.setCardLastFourDigits(request.getCardNumber().substring(request.getCardNumber().length() - 4));
        
        flight.setAvailableSeats(flight.getAvailableSeats() - request.getNumberOfSeats());
        flightRepository.save(flight);
        
        return bookingRepository.save(booking);
    }
    
    public List<Booking> getUserBookings(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return bookingRepository.findByUserId(user.getId());
    }
    
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }
    
    public void deleteBooking(Long id) {
        bookingRepository.deleteById(id);
    }
}
