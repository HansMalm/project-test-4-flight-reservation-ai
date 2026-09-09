package se.lexicon.flightreservationai;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@Disabled("No test datasource configured yet - needs an H2 in-memory profile before this can run")
class FlightReservationBackendApplicationTests {

	@Test
	void contextLoads() {
	}

}
