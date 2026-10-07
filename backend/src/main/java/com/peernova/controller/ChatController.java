package com.peernova.controller;

import com.peernova.dto.ApiResponse;
import com.peernova.dto.ChatConversationDTO;
import com.peernova.dto.ChatMessageDTO;
import com.peernova.dto.ChatMessageRequestDTO;
import com.peernova.service.ChatService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    // WebSocket STOMP endpoint for sending real-time messages
    @MessageMapping("/chat.sendMessage")
    public ChatMessageDTO sendMessageViaWebSocket(@Payload @Valid ChatMessageRequestDTO requestDTO, Principal principal) {
        return chatService.saveAndBroadcastMessage(requestDTO, principal.getName());
    }

    // REST endpoint to post a message
    @PostMapping("/send")
    public ResponseEntity<ApiResponse<ChatMessageDTO>> sendMessageViaRest(@Valid @RequestBody ChatMessageRequestDTO requestDTO, Authentication authentication) {
        ChatMessageDTO dto = chatService.saveAndBroadcastMessage(requestDTO, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Message sent successfully", dto));
    }

    // REST endpoint to list active peer conversations for chat sidebar
    @GetMapping("/conversations")
    public ResponseEntity<ApiResponse<List<ChatConversationDTO>>> getConversations(Authentication authentication) {
        List<ChatConversationDTO> conversations = chatService.getConversations(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Conversations loaded successfully", conversations));
    }

    // REST endpoint to load chat history for a connection
    @GetMapping("/history/{connectionId}")
    public ResponseEntity<ApiResponse<List<ChatMessageDTO>>> getChatHistory(@PathVariable Long connectionId, Authentication authentication) {
        List<ChatMessageDTO> history = chatService.getChatHistory(connectionId, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Chat history loaded successfully", history));
    }

    // REST endpoint to mark unread messages as read
    @PutMapping("/read/{connectionId}")
    public ResponseEntity<ApiResponse<Void>> markMessagesAsRead(@PathVariable Long connectionId, Authentication authentication) {
        chatService.markMessagesAsRead(connectionId, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Messages marked as read", null));
    }

    // REST endpoint to fetch total unread message count for navbar badge
    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Long>> getTotalUnreadCount(Authentication authentication) {
        long count = chatService.getTotalUnreadCount(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Total unread messages count", count));
    }
}
