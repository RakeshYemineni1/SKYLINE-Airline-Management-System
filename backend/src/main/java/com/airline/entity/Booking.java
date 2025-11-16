package com.airline.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Data
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String bookingReference;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    
    @ManyToOne
    @JoinColumn(name = "flight_id", nullable = false)
    private Flight flight;
    
    @Column(nullable = false)
    private String passengerName;
    
    @Column(nullable = false)
    private String passengerEmail;
    
    @Column(nullable = false)
    private String passengerPhone;
    
    private String passportNumber;
    
    @Column(nullable = false)
    private Integer numberOfSeats;
    
    @Column(nullable = false)
    private Double totalAmount;
    
    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;
    
    private String cardLastFourDigits;
    
    private LocalDateTime bookingDate = LocalDateTime.now();
    
    public enum PaymentStatus {
        PENDING, COMPLETED, FAILED
    }
}
