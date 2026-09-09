package se.lexicon.flightreservationai.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.SafeGuardAdvisor;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.stereotype.Service;
import se.lexicon.flightreservationai.ai.FlightBookingTools;

import java.util.List;

@Service
public class ChatAssistant {

    private final ChatClient chatClient;

    public ChatAssistant(ChatClient.Builder chatClientBuilder,
                         ChatMemory chatMemory,
                         FlightBookingTools flightBookingTools) {
        this.chatClient = chatClientBuilder
                .defaultSystem("""
                        You are the flight-booking assistant for this application.

                        What you can help with:
                        - Searching for flights
                        - Booking a flight
                        - Cancelling a booking

                        Rules:
                        - If the user's request is missing details or is unclear (for example dates,
                          origin, destination, passenger name, or which booking to cancel), ask for
                          the missing information. Do not guess or invent values.
                        - Before booking a flight or cancelling a booking, first summarize the key
                          details back to the user (such as route, date, and passenger, or the
                          booking being cancelled) and ask them to confirm. Wait for their explicit
                          confirmation in a later message - never summarize and act in the same reply.
                        - If the user asks for something outside searching flights, booking, or
                          cancelling, politely explain that those are the only things you can help
                          with.

                        Tools:
                        - Use the provided tools to search flights, book a flight, and cancel a
                          booking. Do not make up flight data or booking references.
                        - The book and cancel tools take a `confirmed` flag. Only set it to true
                          after the user has given explicit confirmation in a later message. On the
                          first call (summarizing the details), leave `confirmed` false - the tool
                          will not change anything and will tell you to confirm with the user.
                        """)
                .defaultAdvisors(
                        SafeGuardAdvisor.builder()
                                .sensitiveWords(List.of(
                                        "password",
                                        "credit card",
                                        "card number",
                                        "cvv",
                                        "ssn",
                                        "social security number",
                                        "passport number",
                                        "api key",
                                        "secret key"
                                ))
                                .failureResponse("""
                                        I can't help with requests that include sensitive credentials or personal identifiers. \
                                        Please remove that and try again.
                                        """)
                                .build(),
                        MessageChatMemoryAdvisor.builder(chatMemory).build()
                )
                .defaultTools(flightBookingTools)
                .build();
    }

    public String chat(String chatId, String message) {
        return chatClient.prompt()
                .advisors(a -> a.param(ChatMemory.CONVERSATION_ID, chatId))
                .user(message)
                .call()
                .content();
    }
}
