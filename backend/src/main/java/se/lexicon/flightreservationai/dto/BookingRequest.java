package se.lexicon.flightreservationai.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record BookingRequest(
        @NotNull(message = "Flight id is required")
        Long flightId,

        @NotBlank(message = "Contact name is required")
        String contactName,

        @NotBlank(message = "Contact email is required")
        @Email(message = "Contact email must be a valid email address")
        String contactEmail,

        @NotEmpty(message = "At least one passenger is required")
        @Valid
        List<PassengerInfo> passengers
) {}
