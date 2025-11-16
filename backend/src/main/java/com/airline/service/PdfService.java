package com.airline.service;

import com.airline.entity.Booking;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Service
public class PdfService {
    
    public byte[] generateTicket(Booking booking) {
        try {
            Document document = new Document();
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            PdfWriter.getInstance(document, out);
            
            document.open();
            
            Font titleFont = new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD);
            Font headerFont = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD);
            Font normalFont = new Font(Font.FontFamily.HELVETICA, 10);
            
            Paragraph title = new Paragraph("FLIGHT TICKET", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(new Paragraph("\n"));
            
            document.add(new Paragraph("Booking Reference: " + booking.getBookingReference(), headerFont));
            document.add(new Paragraph("\n"));
            
            document.add(new Paragraph("Passenger Details:", headerFont));
            document.add(new Paragraph("Name: " + booking.getPassengerName(), normalFont));
            document.add(new Paragraph("Email: " + booking.getPassengerEmail(), normalFont));
            document.add(new Paragraph("Phone: " + booking.getPassengerPhone(), normalFont));
            document.add(new Paragraph("\n"));
            
            document.add(new Paragraph("Flight Details:", headerFont));
            document.add(new Paragraph("Flight Number: " + booking.getFlight().getFlightNumber(), normalFont));
            document.add(new Paragraph("From: " + booking.getFlight().getSourceAirport().getName(), normalFont));
            document.add(new Paragraph("To: " + booking.getFlight().getDestinationAirport().getName(), normalFont));
            document.add(new Paragraph("Departure: " + booking.getFlight().getDepartureTime()
                    .format(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm")), normalFont));
            document.add(new Paragraph("Arrival: " + booking.getFlight().getArrivalTime()
                    .format(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm")), normalFont));
            document.add(new Paragraph("\n"));
            
            document.add(new Paragraph("Booking Details:", headerFont));
            document.add(new Paragraph("Number of Seats: " + booking.getNumberOfSeats(), normalFont));
            document.add(new Paragraph("Total Amount: $" + booking.getTotalAmount(), normalFont));
            document.add(new Paragraph("Booking Date: " + booking.getBookingDate()
                    .format(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm")), normalFont));
            
            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF", e);
        }
    }
}
