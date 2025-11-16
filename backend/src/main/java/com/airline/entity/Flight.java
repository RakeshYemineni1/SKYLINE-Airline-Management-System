package com.airline.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "flights")
@Data
public class Flight {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String flightNumber;
    
    @ManyToOne
    @JoinColumn(name = "source_airport_id", nullable = false)
    private Airport sourceAirport;
    
    @ManyToOne
    @JoinColumn(name = "destination_airport_id", nullable = false)
    private Airport destinationAirport;
    
    @Column(nullable = false)
    private LocalDateTime departureTime;
    
    @Column(nullable = false)
    private LocalDateTime arrivalTime;
    
    @Column(nullable = false)
    private Integer totalSeats;
    
    @Column(nullable = false)
    private Integer availableSeats;
    
    @Column(nullable = false)
    private Double price;
    
    private String airline;
}
