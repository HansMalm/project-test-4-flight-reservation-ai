package se.lexicon.flightreservationai.controller;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Bean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ChatController.class)
class ChatControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ChatClient.Builder chatClientBuilder;

    @TestConfiguration
    static class MockChatClientConfig {
        @Bean
        ChatClient.Builder chatClientBuilder() {
            // Deep stubs so the whole prompt().user(...).call().content() chain is mockable in one line.
            return mock(ChatClient.Builder.class, Mockito.RETURNS_DEEP_STUBS);
        }
    }

    @Test
    void blankMessageIsRejectedWith400() throws Exception {
        mockMvc.perform(post("/api/chat")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"message\": \"   \"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.title").value("Validation Failed"));
    }

    @Test
    void validMessageReturnsAssistantReply() throws Exception {
        when(chatClientBuilder.build().prompt().user(anyString()).call().content())
                .thenReturn("Hello from the assistant");

        mockMvc.perform(post("/api/chat")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"message\": \"Hi there\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.reply").value("Hello from the assistant"));
    }
}
