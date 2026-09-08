package se.lexicon.flightreservationai.mapper;

import org.springframework.stereotype.Component;
import se.lexicon.flightreservationai.dto.FlightResponse;
import se.lexicon.flightreservationai.entity.Flight;

@Component
public class FlightMapper {

    public FlightResponse toResponse(Flight flight) {
        return new FlightResponse(
                flight.getId(),
                flight.getFlightNumber(),
                flight.getOrigin(),
                flight.getDestination(),
                flight.getDepartureTime(),
                flight.getArrivalTime(),
                flight.getSeatsRemaining(),
                flight.getPrice()
        );
    }
}
