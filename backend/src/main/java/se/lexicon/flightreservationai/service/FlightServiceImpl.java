package se.lexicon.flightreservationai.service;

import se.lexicon.flightreservationai.entity.Flight;
import se.lexicon.flightreservationai.repository.FlightRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FlightServiceImpl implements FlightService {

    private final FlightRepository flightRepository;

    public FlightServiceImpl(FlightRepository flightRepository) {
        this.flightRepository = flightRepository;
    }

    @Override
    public List<Flight> listAllFlights() {
        return flightRepository.findAllByOrderByDepartureTimeAsc();
    }

    @Override
    public List<Flight> listAvailableFlights() {
        return flightRepository.findAllByOrderByDepartureTimeAsc().stream()
                .filter(flight -> flight.getSeatsRemaining() > 0)
                .collect(Collectors.toList());
    }
}
