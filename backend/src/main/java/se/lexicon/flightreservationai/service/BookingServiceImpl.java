package se.lexicon.flightreservationai.service;

import se.lexicon.flightreservationai.entity.Booking;
import se.lexicon.flightreservationai.entity.BookingStatus;
import se.lexicon.flightreservationai.entity.Flight;
import se.lexicon.flightreservationai.entity.Passenger;
import se.lexicon.flightreservationai.repository.BookingRepository;
import se.lexicon.flightreservationai.repository.FlightRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class BookingServiceImpl implements BookingService {

    private static final DateTimeFormatter REFERENCE_TIMESTAMP_FORMAT =
            DateTimeFormatter.ofPattern("yyyyMMddHHmmss").withZone(ZoneOffset.UTC);

    private final FlightRepository flightRepository;
    private final BookingRepository bookingRepository;

    public BookingServiceImpl(FlightRepository flightRepository, BookingRepository bookingRepository) {
        this.flightRepository = flightRepository;
        this.bookingRepository = bookingRepository;
    }

    @Override
    @Transactional
    public Booking bookFlight(Long flightId, String contactName, String contactEmail, List<Passenger> passengers) {
        Flight flight = flightRepository.findById(flightId)
                .orElseThrow(() -> new IllegalArgumentException("Flight not found: " + flightId));

        int seatsRequested = passengers.size();
        int updatedRows = flightRepository.decrementSeats(flightId, seatsRequested);
        if (updatedRows == 0) {
            throw new IllegalStateException("Not enough seats available on flight " + flightId);
        }

        String bookingReference = flight.getFlightNumber() + "-" + REFERENCE_TIMESTAMP_FORMAT.format(Instant.now());
        BigDecimal totalPrice = flight.getPrice().multiply(BigDecimal.valueOf(seatsRequested));

        Booking booking = new Booking(bookingReference, flight, contactName, contactEmail, totalPrice, BookingStatus.CONFIRMED);
        for (Passenger passenger : passengers) {
            booking.addPassenger(passenger);
        }

        return bookingRepository.save(booking);
    }

    @Override
    @Transactional
    public void cancelBooking(String bookingReference) {
        Booking booking = bookingRepository.findByBookingReference(bookingReference)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found: " + bookingReference));

        flightRepository.incrementSeats(booking.getFlight().getId(), booking.getNumberOfSeats());
        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);
    }

    @Override
    public List<Booking> listBookingsByEmail(String contactEmail) {
        return bookingRepository.findByContactEmail(contactEmail);
    }
}
