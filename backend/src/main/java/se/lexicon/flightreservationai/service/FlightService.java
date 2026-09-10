package se.lexicon.flightreservationai.service;

import se.lexicon.flightreservationai.entity.Flight;

import java.util.List;

public interface FlightService {

    List<Flight> listAllFlights();

    List<Flight> listAvailableFlights();

    Flight getByFlightNumber(String flightNumber);
}
