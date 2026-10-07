package com.peernova.service;

import com.peernova.dto.ChatConversationDTO;
import com.peernova.dto.ChatMessageDTO;
import com.peernova.dto.ChatMessageRequestDTO;
import com.peernova.entity.ChatMessage;
import com.peernova.entity.Connection;
import com.peernova.entity.ConnectionStatus;
import com.peernova.entity.StudentProfile;
import com.peernova.entity.User;
import com.peernova.repository.ChatMessageRepository;
import com.peernova.repository.ConnectionRepository;
import com.peernova.repository.StudentProfileRepository;
import com.peernova.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ChatService {

    private static final Logger logger = LoggerFactory.getLogger(ChatService.class);

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private ConnectionRepository connectionRepository;

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Transactional
    public ChatMessageDTO saveAndBroadcastMessage(ChatMessageRequestDTO requestDTO, String senderEmail) {
        User senderUser = userRepository.findByEmail(senderEmail)
                .orElseThrow(() -> new RuntimeException("Sender user not found: " + senderEmail));

        StudentProfile senderProfile = studentProfileRepository.findByUserId(senderUser.getId())
                .orElseThrow(() -> new RuntimeException("Sender profile not found"));

        Connection connection = connectionRepository.findById(requestDTO.getConnectionId())
                .orElseThrow(() -> new RuntimeException("Connection not found: " + requestDTO.getConnectionId()));

        if (connection.getStatus() != ConnectionStatus.ACCEPTED) {
            throw new RuntimeException("Cannot send message on a non-accepted connection");
        }

        StudentProfile recipientProfile;
        if (connection.getSender().getId().equals(senderProfile.getId())) {
            recipientProfile = connection.getReceiver();
        } else if (connection.getReceiver().getId().equals(senderProfile.getId())) {
            recipientProfile = connection.getSender();
        } else {
            throw new RuntimeException("Unauthorized connection message attempt");
        }

        ChatMessage chatMessage = new ChatMessage(connection, senderProfile, recipientProfile, requestDTO.getContent());
        ChatMessage savedMessage = chatMessageRepository.save(chatMessage);

        ChatMessageDTO dto = mapToDTO(savedMessage);

        // 1. Broadcast to topic subscriber channel for the connection
        String topicDestination = "/topic/connection." + connection.getId();
        messagingTemplate.convertAndSend(topicDestination, dto);

        // 2. Broadcast to user specific queue for recipient notification
        if (recipientProfile.getUser() != null) {
            String userDestination = "/user/" + recipientProfile.getUser().getEmail() + "/queue/messages";
            messagingTemplate.convertAndSend(userDestination, dto);
        }

        logger.info("Chat message [{}] sent from {} to {} on connection {}", savedMessage.getId(), senderUser.getEmail(), recipientProfile.getUser().getEmail(), connection.getId());
        return dto;
    }

    @Transactional(readOnly = true)
    public List<ChatMessageDTO> getChatHistory(Long connectionId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found: " + userEmail));

        StudentProfile profile = studentProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Student profile not found"));

        Connection connection = connectionRepository.findById(connectionId)
                .orElseThrow(() -> new RuntimeException("Connection not found: " + connectionId));

        if (!connection.getSender().getId().equals(profile.getId()) && !connection.getReceiver().getId().equals(profile.getId())) {
            throw new RuntimeException("Unauthorized connection history access");
        }

        List<ChatMessage> messages = chatMessageRepository.findByConnectionIdOrderByTimestampAsc(connectionId);
        return messages.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ChatConversationDTO> getConversations(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found: " + userEmail));

        StudentProfile currentProfile = studentProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Student profile not found"));

        List<Connection> activeConnections = connectionRepository.findActiveConnectionsForProfile(currentProfile.getId());
        List<ChatConversationDTO> conversations = new ArrayList<>();

        for (Connection conn : activeConnections) {
            StudentProfile peer = conn.getSender().getId().equals(currentProfile.getId()) ? conn.getReceiver() : conn.getSender();
            
            Optional<ChatMessage> lastMsgOpt = chatMessageRepository.findFirstByConnectionIdOrderByTimestampDesc(conn.getId());
            long unread = chatMessageRepository.countByConnectionIdAndRecipientIdAndIsReadFalse(conn.getId(), currentProfile.getId());

            String lastMessageText = lastMsgOpt.isPresent() ? lastMsgOpt.get().getContent() : "Connected! Start conversation...";
            LocalDateTime lastTime = lastMsgOpt.isPresent() ? lastMsgOpt.get().getTimestamp() : conn.getUpdatedAt();

            ChatConversationDTO dto = new ChatConversationDTO(
                    conn.getId(),
                    peer.getId(),
                    peer.getUser().getFullName(),
                    peer.getCollege(),
                    peer.getDepartment(),
                    peer.getVerificationStatus() != null ? peer.getVerificationStatus().name() : "PENDING",
                    lastMessageText,
                    lastTime,
                    unread
            );
            conversations.add(dto);
        }

        conversations.sort((a, b) -> {
            if (a.getLastMessageTimestamp() == null) return 1;
            if (b.getLastMessageTimestamp() == null) return -1;
            return b.getLastMessageTimestamp().compareTo(a.getLastMessageTimestamp());
        });

        return conversations;
    }

    @Transactional
    public void markMessagesAsRead(Long connectionId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found: " + userEmail));

        StudentProfile profile = studentProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Student profile not found"));

        int updatedCount = chatMessageRepository.markMessagesAsRead(connectionId, profile.getId());
        logger.info("Marked {} messages as read for user {} on connection {}", updatedCount, userEmail, connectionId);
    }

    @Transactional(readOnly = true)
    public long getTotalUnreadCount(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found: " + userEmail));

        StudentProfile profile = studentProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Student profile not found"));

        return chatMessageRepository.countByRecipientIdAndIsReadFalse(profile.getId());
    }

    private ChatMessageDTO mapToDTO(ChatMessage msg) {
        return new ChatMessageDTO(
                msg.getId(),
                msg.getConnection().getId(),
                msg.getSender().getId(),
                msg.getSender().getUser() != null ? msg.getSender().getUser().getFullName() : "Peer",
                msg.getRecipient().getId(),
                msg.getRecipient().getUser() != null ? msg.getRecipient().getUser().getFullName() : "Peer",
                msg.getContent(),
                msg.isRead(),
                msg.getTimestamp()
        );
    }
}
