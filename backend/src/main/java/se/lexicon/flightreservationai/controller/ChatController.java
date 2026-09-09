package se.lexicon.flightreservationai.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import se.lexicon.flightreservationai.dto.ChatRequest;
import se.lexicon.flightreservationai.dto.ChatResponse;
import se.lexicon.flightreservationai.service.ChatAssistant;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatAssistant chatAssistant;

    public ChatController(ChatAssistant chatAssistant) {
        this.chatAssistant = chatAssistant;
    }

    @PostMapping
    public ResponseEntity<ChatResponse> chat(@Valid @RequestBody ChatRequest request) {
        String reply = chatAssistant.chat(request.message());
        return ResponseEntity.ok(new ChatResponse(reply));
    }
}
