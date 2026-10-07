package com.peernova.repository;

import com.peernova.entity.Connection;
import com.peernova.entity.ConnectionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConnectionRepository extends JpaRepository<Connection, Long> {

    List<Connection> findByReceiverIdAndStatus(Long receiverProfileId, ConnectionStatus status);

    List<Connection> findBySenderIdAndStatus(Long senderProfileId, ConnectionStatus status);

    @Query("SELECT c FROM Connection c WHERE (c.sender.id = :profileId OR c.receiver.id = :profileId) AND c.status = 'ACCEPTED'")
    List<Connection> findActiveConnectionsForProfile(Long profileId);

    @Query("SELECT c FROM Connection c WHERE (c.sender.id = :p1 AND c.receiver.id = :p2) OR (c.sender.id = :p2 AND c.receiver.id = :p1)")
    Optional<Connection> findConnectionBetween(Long p1, Long p2);

    @Query("SELECT COUNT(c) FROM Connection c WHERE (c.sender.id = :profileId OR c.receiver.id = :profileId) AND c.status = 'ACCEPTED'")
    long countActiveConnectionsForProfile(Long profileId);
}
