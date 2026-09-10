package se.lexicon.flightreservationai.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import se.lexicon.flightreservationai.dto.FlightResponse;
import se.lexicon.flightreservationai.mapper.FlightMapper;
import se.lexicon.flightreservationai.service.FlightService;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/flights")
public class FlightController {

    private final FlightService flightService;
    private final FlightMapper flightMapper;

    public FlightController(FlightService flightService, FlightMapper flightMapper) {
        this.flightService = flightService;
        this.flightMapper = flightMapper;
    }

    @GetMapping
    public ResponseEntity<List<FlightResponse>> listAllFlights() {
        List<FlightResponse> flights = flightService.listAllFlights().stream()
                .map(flightMapper::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(flights);
    }

    @GetMapping("/available")
    public ResponseEntity<List<FlightResponse>> listAvailableFlights() {
        List<FlightResponse> flights = flightService.listAvailableFlights().stream()
                .map(flightMapper::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(flights);
    }

    @GetMapping("/{flightNumber}")
    public ResponseEntity<FlightResponse> getFlight(@PathVariable String flightNumber) {
        FlightResponse flight = flightMapper.toResponse(flightService.getByFlightNumber(flightNumber));
        return ResponseEntity.ok(flight);
    }
}
