package com.airline.dto;

import lombok.Data;

@Data
public class BookingRequest {
    private Long flightId;
    private String passengerName;
    private String passengerEmail;
    private String passengerPhone;
    private String passportNumber;
    private Integer numberOfSeats;
    private String cardNumber;
    private String cardExpiry;
    private String cardCvv;
}
