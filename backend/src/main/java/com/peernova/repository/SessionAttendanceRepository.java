package com.peernova.repository;

import com.peernova.entity.SessionAttendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SessionAttendanceRepository extends JpaRepository<SessionAttendance, Long> {

    List<SessionAttendance> findBySessionId(Long sessionId);

    Optional<SessionAttendance> findBySessionIdAndStudentId(Long sessionId, Long studentProfileId);

    List<SessionAttendance> findByStudentIdOrderByJoinedAtDesc(Long studentProfileId);

    long countByStudentId(Long studentProfileId);
}
