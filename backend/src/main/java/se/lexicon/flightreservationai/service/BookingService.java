package se.lexicon.flightreservationai.service;

import se.lexicon.flightreservationai.entity.Booking;
import se.lexicon.flightreservationai.entity.Passenger;

import java.util.List;

public interface BookingService {

    Booking bookFlight(String flightNumber, String contactName, String contactEmail, List<Passenger> passengers);

    void cancelBooking(String bookingReference);

    List<Booking> listBookingsByEmail(String contactEmail);
}
