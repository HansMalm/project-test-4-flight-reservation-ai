package se.lexicon.flightreservationai.repository;

import se.lexicon.flightreservationai.entity.Flight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface FlightRepository extends JpaRepository<Flight, Long> {

    Optional<Flight> findByFlightNumber(String flightNumber);

    @Modifying
    @Transactional
    @Query("UPDATE Flight f SET f.seatsRemaining = f.seatsRemaining - :seats " +
           "WHERE f.id = :flightId AND f.seatsRemaining >= :seats")
    int decrementSeats(@Param("flightId") Long flightId, @Param("seats") int seats);

    @Modifying
    @Transactional
    @Query("UPDATE Flight f SET f.seatsRemaining = f.seatsRemaining + :seats WHERE f.id = :flightId")
    int incrementSeats(@Param("flightId") Long flightId, @Param("seats") int seats);
}
