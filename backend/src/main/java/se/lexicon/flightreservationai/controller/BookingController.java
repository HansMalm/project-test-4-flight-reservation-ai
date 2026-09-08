package se.lexicon.flightreservationai.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import se.lexicon.flightreservationai.dto.BookingRequest;
import se.lexicon.flightreservationai.dto.BookingResponse;
import se.lexicon.flightreservationai.entity.Booking;
import se.lexicon.flightreservationai.entity.Passenger;
import se.lexicon.flightreservationai.mapper.BookingMapper;
import se.lexicon.flightreservationai.service.BookingService;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;
    private final BookingMapper bookingMapper;

    public BookingController(BookingService bookingService, BookingMapper bookingMapper) {
        this.bookingService = bookingService;
        this.bookingMapper = bookingMapper;
    }

    @PostMapping
    public ResponseEntity<BookingResponse> bookFlight(@RequestBody BookingRequest request) {
        List<Passenger> passengers = request.passengers().stream()
                .map(bookingMapper::toPassengerEntity)
                .collect(Collectors.toList());

        Booking booking = bookingService.bookFlight(
                request.flightId(),
                request.contactName(),
                request.contactEmail(),
                passengers
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(bookingMapper.toResponse(booking));
    }

    @DeleteMapping("/{bookingReference}")
    public ResponseEntity<Void> cancelBooking(@PathVariable String bookingReference) {
        bookingService.cancelBooking(bookingReference);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<BookingResponse>> listBookingsByEmail(@RequestParam String email) {
        List<BookingResponse> bookings = bookingService.listBookingsByEmail(email).stream()
                .map(bookingMapper::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(bookings);
    }
}
