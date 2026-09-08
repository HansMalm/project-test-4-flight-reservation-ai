package se.lexicon.flightreservationai.dto;

import jakarta.validation.constraints.NotBlank;

public record PassengerInfo(
        @NotBlank(message = "Passenger name is required")
        String name,
        boolean isChild
) {}
