package com.peernova.repository;

import com.peernova.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    List<ChatMessage> findByConnectionIdOrderByTimestampAsc(Long connectionId);

    long countByRecipientIdAndIsReadFalse(Long recipientProfileId);

    long countByConnectionIdAndRecipientIdAndIsReadFalse(Long connectionId, Long recipientProfileId);

    Optional<ChatMessage> findFirstByConnectionIdOrderByTimestampDesc(Long connectionId);

    @Transactional
    @Modifying
    @Query("UPDATE ChatMessage m SET m.isRead = true WHERE m.connection.id = :connectionId AND m.recipient.id = :recipientProfileId AND m.isRead = false")
    int markMessagesAsRead(@Param("connectionId") Long connectionId, @Param("recipientProfileId") Long recipientProfileId);
}
