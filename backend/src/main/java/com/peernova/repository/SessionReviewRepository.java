package com.peernova.repository;

import com.peernova.entity.SessionReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SessionReviewRepository extends JpaRepository<SessionReview, Long> {

    List<SessionReview> findBySessionIdOrderByCreatedAtDesc(Long sessionId);

    List<SessionReview> findByRevieweeIdOrderByCreatedAtDesc(Long revieweeId);

    List<SessionReview> findByReviewerIdOrderByCreatedAtDesc(Long reviewerId);

    Optional<SessionReview> findBySessionIdAndReviewerId(Long sessionId, Long reviewerId);

    boolean existsBySessionIdAndReviewerId(Long sessionId, Long reviewerId);

    List<SessionReview> findAllByOrderByCreatedAtDesc();

    @Query("SELECT AVG(r.rating) FROM SessionReview r WHERE r.reviewee.id = :revieweeId AND r.isFlagged = false")
    Double getAverageRatingForReviewee(@Param("revieweeId") Long revieweeId);

    long countByRevieweeIdAndIsFlaggedFalse(Long revieweeId);
}
