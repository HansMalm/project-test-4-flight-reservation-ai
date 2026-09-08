package se.lexicon.flightreservationai.repository;

import se.lexicon.flightreservationai.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByContactEmail(String contactEmail);

    Optional<Booking> findByBookingReference(String bookingReference);
}
