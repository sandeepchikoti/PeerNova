package com.peernova.service;

import com.peernova.dto.CreateReviewRequest;
import com.peernova.dto.SessionReviewDTO;
import com.peernova.entity.*;
import com.peernova.exception.BadRequestException;
import com.peernova.exception.ResourceNotFoundException;
import com.peernova.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    @Autowired
    private SessionReviewRepository sessionReviewRepository;

    @Autowired
    private LearningSessionRepository learningSessionRepository;

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Autowired
    private UserRepository userRepository;

    // Student: Submit a peer review for a completed learning session
    @Transactional
    public SessionReviewDTO submitReview(String email, Long sessionId, CreateReviewRequest request) {
        StudentProfile reviewer = getStudentProfileByEmail(email);
        LearningSession session = learningSessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Learning session not found with ID: " + sessionId));

        if (session.getStatus() != SessionStatus.COMPLETED) {
            throw new BadRequestException("Reviews can only be submitted for COMPLETED learning sessions");
        }

        boolean isLearner = session.getLearner().getId().equals(reviewer.getId());
        boolean isMentor = session.getMentor().getId().equals(reviewer.getId());

        if (!isLearner && !isMentor) {
            throw new BadRequestException("You were not a participant in this learning session");
        }

        if (sessionReviewRepository.existsBySessionIdAndReviewerId(sessionId, reviewer.getId())) {
            throw new BadRequestException("You have already submitted a review for this session");
        }

        // Reviewee is the other peer in the session
        StudentProfile reviewee = isLearner ? session.getMentor() : session.getLearner();

        SessionReview review = new SessionReview(
                session,
                reviewer,
                reviewee,
                request.getRating(),
                request.getCommunicationRating(),
                request.getKnowledgeRating(),
                request.getComment()
        );

        SessionReview saved = sessionReviewRepository.save(review);

        // Recalculate reviewee average rating & total review count
        updateStudentAggregateRating(reviewee.getId());

        return SessionReviewDTO.fromEntity(saved);
    }

    // List reviews for a specific session
    @Transactional(readOnly = true)
    public List<SessionReviewDTO> getSessionReviews(Long sessionId) {
        return sessionReviewRepository.findBySessionIdOrderByCreatedAtDesc(sessionId).stream()
                .map(SessionReviewDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // List reviews received by current logged-in student
    @Transactional(readOnly = true)
    public List<SessionReviewDTO> getMyReceivedReviews(String email) {
        StudentProfile student = getStudentProfileByEmail(email);
        return sessionReviewRepository.findByRevieweeIdOrderByCreatedAtDesc(student.getId()).stream()
                .filter(r -> !r.isFlagged())
                .map(SessionReviewDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // List reviews given by current student
    @Transactional(readOnly = true)
    public List<SessionReviewDTO> getMyGivenReviews(String email) {
        StudentProfile student = getStudentProfileByEmail(email);
        return sessionReviewRepository.findByReviewerIdOrderByCreatedAtDesc(student.getId()).stream()
                .map(SessionReviewDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // Public / Peer profile: View reviews received by any student
    @Transactional(readOnly = true)
    public List<SessionReviewDTO> getReviewsByStudentProfileId(Long profileId) {
        return sessionReviewRepository.findByRevieweeIdOrderByCreatedAtDesc(profileId).stream()
                .filter(r -> !r.isFlagged())
                .map(SessionReviewDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // Admin: List all reviews across platform for moderation
    @Transactional(readOnly = true)
    public List<SessionReviewDTO> getAllReviewsForAdmin() {
        return sessionReviewRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(SessionReviewDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // Admin: Flag or unflag a review
    @Transactional
    public SessionReviewDTO toggleFlagReview(Long reviewId, boolean flagged) {
        SessionReview review = sessionReviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with ID: " + reviewId));
        review.setFlagged(flagged);
        SessionReview updated = sessionReviewRepository.save(review);

        // Recalculate reviewee aggregate rating since flagged reviews are excluded
        updateStudentAggregateRating(review.getReviewee().getId());

        return SessionReviewDTO.fromEntity(updated);
    }

    private void updateStudentAggregateRating(Long profileId) {
        Double avg = sessionReviewRepository.getAverageRatingForReviewee(profileId);
        long count = sessionReviewRepository.countByRevieweeIdAndIsFlaggedFalse(profileId);

        StudentProfile profile = studentProfileRepository.findById(profileId).orElse(null);
        if (profile != null) {
            double formattedAvg = avg != null ? Math.round(avg * 10.0) / 10.0 : 0.0;
            profile.setAverageRating(formattedAvg);
            profile.setTotalReviews((int) count);
            studentProfileRepository.save(profile);
        }
    }

    private StudentProfile getStudentProfileByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return studentProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for user: " + email));
    }
}
