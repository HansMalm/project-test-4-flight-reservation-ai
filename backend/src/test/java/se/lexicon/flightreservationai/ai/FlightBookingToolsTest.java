package se.lexicon.flightreservationai.ai;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import se.lexicon.flightreservationai.dto.PassengerInfo;
import se.lexicon.flightreservationai.entity.Booking;
import se.lexicon.flightreservationai.entity.Passenger;
import se.lexicon.flightreservationai.exception.FlightBookingException;
import se.lexicon.flightreservationai.exception.ResourceNotFoundException;
import se.lexicon.flightreservationai.service.BookingService;
import se.lexicon.flightreservationai.service.FlightService;

import java.math.BigDecimal;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class FlightBookingToolsTest {

    @Mock
    FlightService flightService;

    @Mock
    BookingService bookingService;

    @InjectMocks
    FlightBookingTools tools;

    @Test
    void bookFlight_notConfirmed_returnsNotBookedMessageAndDoesNotCallService() {
        String result = tools.bookFlight(
                "FR123", "Jane Doe", "jane@example.com",
                List.of(new PassengerInfo("Jane Doe", false)),
                false);

        assertThat(result)
                .startsWith("Not booked.")
                .contains("FR123")
                .contains("confirmed=true");
        verify(bookingService, never()).bookFlight(any(), any(), any(), anyList());
    }

    @Test
    void bookFlight_confirmed_mapsPassengersAndReturnsMessageFromBooking() {
        Booking booking = org.mockito.Mockito.mock(Booking.class);
        when(booking.getBookingReference()).thenReturn("FR123-20260101000000");
        when(booking.getTotalPrice()).thenReturn(new BigDecimal("2500.00"));
        when(booking.getNumberOfSeats()).thenReturn(2);
        when(bookingService.bookFlight(eq("FR123"), eq("Jane Doe"), eq("jane@example.com"), anyList()))
                .thenReturn(booking);

        String result = tools.bookFlight(
                "FR123", "Jane Doe", "jane@example.com",
                List.of(new PassengerInfo("Jane Doe", false), new PassengerInfo("Tim Doe", true)),
                true);

        @SuppressWarnings("unchecked")
        ArgumentCaptor<List<Passenger>> captor = ArgumentCaptor.forClass(List.class);
        verify(bookingService).bookFlight(eq("FR123"), eq("Jane Doe"), eq("jane@example.com"), captor.capture());

        List<Passenger> mapped = captor.getValue();
        assertThat(mapped).hasSize(2);
        assertThat(mapped.get(0).getName()).isEqualTo("Jane Doe");
        assertThat(mapped.get(0).isChild()).isFalse();
        assertThat(mapped.get(1).getName()).isEqualTo("Tim Doe");
        assertThat(mapped.get(1).isChild()).isTrue();

        assertThat(result).isEqualTo(
                "Booking confirmed. Reference: FR123-20260101000000. Total price: 2500.00 for 2 passenger(s).");
    }

    @Test
    void bookFlight_confirmed_flightNotFound_returnsGracefulMessage() {
        when(bookingService.bookFlight(eq("FR999"), any(), any(), anyList()))
                .thenThrow(new ResourceNotFoundException("Flight not found: FR999"));

        String result = tools.bookFlight(
                "FR999", "Jane Doe", "jane@example.com",
                List.of(new PassengerInfo("Jane Doe", false)),
                true);

        assertThat(result).isEqualTo("Booking failed: Flight not found: FR999");
    }

    @Test
    void bookFlight_confirmed_notEnoughSeats_returnsGracefulMessage() {
        when(bookingService.bookFlight(eq("FR123"), any(), any(), anyList()))
                .thenThrow(new FlightBookingException("Not enough seats available on flight FR123"));

        String result = tools.bookFlight(
                "FR123", "Jane Doe", "jane@example.com",
                List.of(new PassengerInfo("Jane Doe", false), new PassengerInfo("Tim Doe", true)),
                true);

        assertThat(result).isEqualTo("Booking failed: Not enough seats available on flight FR123");
    }

    @Test
    void cancelBooking_confirmed_bookingNotFound_returnsGracefulMessage() {
        doThrow(new ResourceNotFoundException("Booking not found: BR999"))
                .when(bookingService).cancelBooking("BR999");

        String result = tools.cancelBooking("BR999", true);

        assertThat(result).isEqualTo("Cancellation failed: Booking not found: BR999");
    }

    @Test
    void cancelBooking_notConfirmed_returnsNotCancelledMessageAndDoesNotCallService() {
        String result = tools.cancelBooking("FR123-20260101000000", false);

        assertThat(result)
                .startsWith("Not cancelled.")
                .contains("FR123-20260101000000")
                .contains("confirmed=true");
        verifyNoInteractions(bookingService);
    }

    @Test
    void cancelBooking_confirmed_callsServiceAndReturnsConfirmationMessage() {
        String result = tools.cancelBooking("FR123-20260101000000", true);

        verify(bookingService).cancelBooking("FR123-20260101000000");
        assertThat(result).isEqualTo("Booking FR123-20260101000000 has been cancelled.");
    }
}
