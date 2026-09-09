package se.lexicon.flightreservationai.ai;

import org.springframework.ai.tool.annotation.Tool;
import org.springframework.stereotype.Component;
import se.lexicon.flightreservationai.dto.PassengerInfo;
import se.lexicon.flightreservationai.entity.Booking;
import se.lexicon.flightreservationai.entity.Flight;
import se.lexicon.flightreservationai.entity.Passenger;
import se.lexicon.flightreservationai.service.BookingService;
import se.lexicon.flightreservationai.service.FlightService;

import java.util.List;

/**
 * AI tool adapter over {@link FlightService} / {@link BookingService}.
 *
 * <p>Each method is exposed to the chat model via {@code @Tool}. This class exists so the
 * AI-specific {@code confirmed} gate lives outside the REST-facing service interfaces:
 * booking and cancellation only reach the underlying service when {@code confirmed} is true.
 */
@Component
public class FlightBookingTools {

    private final FlightService flightService;
    private final BookingService bookingService;

    public FlightBookingTools(FlightService flightService, BookingService bookingService) {
        this.flightService = flightService;
        this.bookingService = bookingService;
    }

    @Tool(description = "Search flights that currently have seats available. "
            + "Returns flight number, origin, destination, departure/arrival times, seats remaining and price.")
    public List<Flight> searchAvailableFlights() {
        return flightService.listAvailableFlights();
    }

    @Tool(description = "Book a flight. Only set confirmed=true after the user has explicitly "
            + "confirmed the booking in their own words. If confirmed is false or omitted, no booking is made.")
    public String bookFlight(String flightNumber,
                             String contactName,
                             String contactEmail,
                             List<PassengerInfo> passengers,
                             boolean confirmed) {
        int passengerCount = passengers == null ? 0 : passengers.size();

        if (!confirmed) {
            return "Not booked. Ask the user to explicitly confirm they want to book flight "
                    + flightNumber + " for " + passengerCount + " passenger(s) (contact "
                    + contactName + ", " + contactEmail + "), then call this tool again with confirmed=true.";
        }

        List<Passenger> passengerEntities = passengers.stream()
                .map(info -> new Passenger(info.name(), info.isChild(), null))
                .toList();

        Booking booking = bookingService.bookFlight(flightNumber, contactName, contactEmail, passengerEntities);

        return "Booking confirmed. Reference: " + booking.getBookingReference()
                + ". Total price: " + booking.getTotalPrice()
                + " for " + booking.getNumberOfSeats() + " passenger(s).";
    }

    @Tool(description = "Cancel an existing booking by its booking reference. Only set confirmed=true "
            + "after the user has explicitly confirmed the cancellation. If confirmed is false or omitted, nothing is cancelled.")
    public String cancelBooking(String bookingReference, boolean confirmed) {
        if (!confirmed) {
            return "Not cancelled. Ask the user to explicitly confirm they want to cancel booking "
                    + bookingReference + ", then call this tool again with confirmed=true.";
        }

        bookingService.cancelBooking(bookingReference);

        return "Booking " + bookingReference + " has been cancelled.";
    }
}
