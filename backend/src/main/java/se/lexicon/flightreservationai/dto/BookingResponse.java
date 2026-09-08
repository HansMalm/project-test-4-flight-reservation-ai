package se.lexicon.flightreservationai.dto;

import se.lexicon.flightreservationai.entity.BookingStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record BookingResponse(
        String bookingReference,
        FlightResponse flight,
        String contactName,
        String contactEmail,
        List<PassengerInfo> passengers,
        BigDecimal totalPrice,
        BookingStatus status,
        Instant bookedAt
) {}
