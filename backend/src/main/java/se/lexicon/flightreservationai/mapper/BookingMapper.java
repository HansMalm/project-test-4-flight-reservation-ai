package se.lexicon.flightreservationai.mapper;

import org.springframework.stereotype.Component;
import se.lexicon.flightreservationai.dto.BookingResponse;
import se.lexicon.flightreservationai.dto.PassengerInfo;
import se.lexicon.flightreservationai.entity.Booking;
import se.lexicon.flightreservationai.entity.Passenger;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class BookingMapper {

    private final FlightMapper flightMapper;

    public BookingMapper(FlightMapper flightMapper) {
        this.flightMapper = flightMapper;
    }

    public BookingResponse toResponse(Booking booking) {
        List<PassengerInfo> passengers = booking.getPassengers().stream()
                .map(p -> new PassengerInfo(p.getName(), p.isChild()))
                .collect(Collectors.toList());

        return new BookingResponse(
                booking.getBookingReference(),
                flightMapper.toResponse(booking.getFlight()),
                booking.getContactName(),
                booking.getContactEmail(),
                passengers,
                booking.getTotalPrice(),
                booking.getStatus(),
                booking.getBookedAt()
        );
    }

    public Passenger toPassengerEntity(PassengerInfo passengerInfo) {
        return new Passenger(passengerInfo.name(), passengerInfo.isChild(), null);
    }
}
