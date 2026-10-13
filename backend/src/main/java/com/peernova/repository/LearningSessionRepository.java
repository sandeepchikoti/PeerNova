package com.peernova.repository;

import com.peernova.entity.LearningSession;
import com.peernova.entity.SessionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LearningSessionRepository extends JpaRepository<LearningSession, Long> {

    @Query("SELECT s FROM LearningSession s WHERE s.mentor.id = :profileId OR s.learner.id = :profileId ORDER BY s.scheduledAt DESC")
    List<LearningSession> findAllForStudent(@Param("profileId") Long profileId);

    @Query("SELECT s FROM LearningSession s WHERE (s.mentor.id = :profileId OR s.learner.id = :profileId) AND s.status = :status ORDER BY s.scheduledAt ASC")
    List<LearningSession> findByStudentAndStatus(@Param("profileId") Long profileId, @Param("status") SessionStatus status);

    @Query("SELECT COUNT(s) FROM LearningSession s WHERE s.mentor.id = :profileId OR s.learner.id = :profileId")
    long countByStudentProfileId(@Param("profileId") Long profileId);

    @Query("SELECT COUNT(s) FROM LearningSession s WHERE (s.mentor.id = :profileId OR s.learner.id = :profileId) AND s.status = 'COMPLETED'")
    long countCompletedByStudentProfileId(@Param("profileId") Long profileId);
}
