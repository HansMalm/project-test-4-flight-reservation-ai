package se.lexicon.flightreservationai.dto;

import java.util.List;

public record BookingRequest(
        Long flightId,
        String contactName,
        String contactEmail,
        List<PassengerInfo> passengers
) {}
