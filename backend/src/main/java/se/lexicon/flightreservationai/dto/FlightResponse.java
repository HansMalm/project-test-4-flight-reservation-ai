package se.lexicon.flightreservationai.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record FlightResponse(
        String flightNumber,
        String origin,
        String destination,
        LocalDateTime departureTime,
        LocalDateTime arrivalTime,
        int seatsRemaining,
        BigDecimal price
) {
}
