package se.lexicon.flightreservationai.dto;

import jakarta.validation.constraints.NotBlank;

public record ChatRequest(
        @NotBlank(message = "Message is required")
        String message,

        @NotBlank(message = "Chat id is required")
        String chatId
) {}
