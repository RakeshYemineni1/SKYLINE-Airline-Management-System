package com.airline.controller;

import com.airline.dto.BookingRequest;
import com.airline.entity.Booking;
import com.airline.repository.BookingRepository;
import com.airline.service.BookingService;
import com.airline.service.PdfService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customer")
public class CustomerController {
    private final BookingService bookingService;
    private final PdfService pdfService;
    private final BookingRepository bookingRepository;
    
    public CustomerController(BookingService bookingService, PdfService pdfService, 
                            BookingRepository bookingRepository) {
        this.bookingService = bookingService;
        this.pdfService = pdfService;
        this.bookingRepository = bookingRepository;
    }
    
    @PostMapping("/bookings")
    public ResponseEntity<?> createBooking(@RequestBody BookingRequest request, 
                                          Authentication authentication) {
        return ResponseEntity.ok(bookingService.createBooking(request, authentication.getName()));
    }
    
    @GetMapping("/bookings")
    public ResponseEntity<?> getMyBookings(Authentication authentication) {
        return ResponseEntity.ok(bookingService.getUserBookings(authentication.getName()));
    }
    
    @GetMapping("/bookings/{id}/ticket")
    public ResponseEntity<byte[]> downloadTicket(@PathVariable Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        byte[] pdf = pdfService.generateTicket(booking);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "ticket-" + booking.getBookingReference() + ".pdf");
        
        return ResponseEntity.ok().headers(headers).body(pdf);
    }
}
