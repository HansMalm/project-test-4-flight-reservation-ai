package se.lexicon.flightreservationai.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class FlightBookingException extends RuntimeException {
    public FlightBookingException(String message) {
        super(message);
    }
}
