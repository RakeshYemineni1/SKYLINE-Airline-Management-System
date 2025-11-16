package com.airline.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "airports")
@Data
public class Airport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String code;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String city;
    
    @Column(nullable = false)
    private String country;
}
