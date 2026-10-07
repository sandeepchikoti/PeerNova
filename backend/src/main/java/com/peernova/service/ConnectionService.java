package com.peernova.service;

import com.peernova.dto.ConnectionResponseDTO;
import com.peernova.dto.SendConnectionRequest;
import com.peernova.entity.*;
import com.peernova.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ConnectionService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Autowired
    private ConnectionRepository connectionRepository;

    @Transactional
    public ConnectionResponseDTO sendConnectionRequest(String senderEmail, SendConnectionRequest request) {
        User senderUser = userRepository.findByEmail(senderEmail)
                .orElseThrow(() -> new RuntimeException("Sender user not found: " + senderEmail));

        StudentProfile senderProfile = studentProfileRepository.findByUserId(senderUser.getId())
                .orElseThrow(() -> new RuntimeException("Sender profile not found"));

        StudentProfile receiverProfile = studentProfileRepository.findById(request.getReceiverProfileId())
                .orElseThrow(() -> new RuntimeException("Receiver profile not found with ID: " + request.getReceiverProfileId()));

        if (senderProfile.getId().equals(receiverProfile.getId())) {
            throw new RuntimeException("You cannot send a connection request to yourself.");
        }

        Optional<Connection> existing = connectionRepository.findConnectionBetween(senderProfile.getId(), receiverProfile.getId());
        if (existing.isPresent()) {
            Connection conn = existing.get();
            if (conn.getStatus() == ConnectionStatus.ACCEPTED) {
                throw new RuntimeException("You are already connected with " + receiverProfile.getUser().getFullName());
            } else if (conn.getStatus() == ConnectionStatus.PENDING) {
                throw new RuntimeException("A connection request is already pending with " + receiverProfile.getUser().getFullName());
            } else {
                // Re-open rejected request
                conn.setStatus(ConnectionStatus.PENDING);
                conn.setSender(senderProfile);
                conn.setReceiver(receiverProfile);
                conn.setMessage(request.getMessage());
                Connection updated = connectionRepository.save(conn);
                return mapToDTO(updated);
            }
        }

        Connection connection = new Connection(
                senderProfile,
                receiverProfile,
                request.getMessage() != null && !request.getMessage().isBlank() 
                        ? request.getMessage().trim() 
                        : "Hi " + receiverProfile.getUser().getFullName() + ", I would love to connect and exchange skills with you on PeerNova!"
        );

        Connection saved = connectionRepository.save(connection);
        return mapToDTO(saved);
    }

    @Transactional
    public ConnectionResponseDTO respondToConnectionRequest(String receiverEmail, Long connectionId, ConnectionStatus newStatus) {
        User receiverUser = userRepository.findByEmail(receiverEmail)
                .orElseThrow(() -> new RuntimeException("User not found: " + receiverEmail));

        StudentProfile receiverProfile = studentProfileRepository.findByUserId(receiverUser.getId())
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        Connection connection = connectionRepository.findById(connectionId)
                .orElseThrow(() -> new RuntimeException("Connection request not found with ID: " + connectionId));

        if (!connection.getReceiver().getId().equals(receiverProfile.getId())) {
            throw new RuntimeException("You are not authorized to respond to this connection request.");
        }

        connection.setStatus(newStatus);
        Connection updated = connectionRepository.save(connection);
        return mapToDTO(updated);
    }

    public List<ConnectionResponseDTO> getPendingRequestsReceived(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        StudentProfile profile = studentProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        return connectionRepository.findByReceiverIdAndStatus(profile.getId(), ConnectionStatus.PENDING)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<ConnectionResponseDTO> getPendingRequestsSent(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        StudentProfile profile = studentProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        return connectionRepository.findBySenderIdAndStatus(profile.getId(), ConnectionStatus.PENDING)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<ConnectionResponseDTO> getActiveConnections(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        StudentProfile profile = studentProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        return connectionRepository.findActiveConnectionsForProfile(profile.getId())
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private ConnectionResponseDTO mapToDTO(Connection conn) {
        ConnectionResponseDTO dto = new ConnectionResponseDTO();
        dto.setId(conn.getId());

        if (conn.getSender() != null && conn.getSender().getUser() != null) {
            dto.setSenderProfileId(conn.getSender().getId());
            dto.setSenderName(conn.getSender().getUser().getFullName());
            dto.setSenderEmail(conn.getSender().getUser().getEmail());
            dto.setSenderCollege(conn.getSender().getCollege());
            dto.setSenderDepartment(conn.getSender().getDepartment());
        }

        if (conn.getReceiver() != null && conn.getReceiver().getUser() != null) {
            dto.setReceiverProfileId(conn.getReceiver().getId());
            dto.setReceiverName(conn.getReceiver().getUser().getFullName());
            dto.setReceiverEmail(conn.getReceiver().getUser().getEmail());
            dto.setReceiverCollege(conn.getReceiver().getCollege());
            dto.setReceiverDepartment(conn.getReceiver().getDepartment());
        }

        dto.setStatus(conn.getStatus());
        dto.setMessage(conn.getMessage());
        dto.setCreatedAt(conn.getCreatedAt());
        dto.setUpdatedAt(conn.getUpdatedAt());
        return dto;
    }
}
