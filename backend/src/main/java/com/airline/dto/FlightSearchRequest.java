package com.airline.dto;

import lombok.Data;

@Data
public class FlightSearchRequest {
    private String flightNumber;
    private String source;
    private String destination;
    private String date;
}
