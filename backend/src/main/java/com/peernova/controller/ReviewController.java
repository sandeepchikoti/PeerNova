package com.peernova.controller;

import com.peernova.dto.ApiResponse;
import com.peernova.dto.CreateReviewRequest;
import com.peernova.dto.SessionReviewDTO;
import com.peernova.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    // Student: Submit peer review and rating for completed learning session
    @PostMapping("/reviews/session/{sessionId}")
    public ResponseEntity<ApiResponse<SessionReviewDTO>> submitReview(
            @PathVariable Long sessionId,
            @Valid @RequestBody CreateReviewRequest request,
            Authentication authentication) {
        SessionReviewDTO dto = reviewService.submitReview(authentication.getName(), sessionId, request);
        return ResponseEntity.ok(ApiResponse.success("Review submitted successfully", dto));
    }

    // Student / Public: Get reviews for a session
    @GetMapping("/reviews/session/{sessionId}")
    public ResponseEntity<ApiResponse<List<SessionReviewDTO>>> getSessionReviews(@PathVariable Long sessionId) {
        List<SessionReviewDTO> reviews = reviewService.getSessionReviews(sessionId);
        return ResponseEntity.ok(ApiResponse.success("Session reviews loaded", reviews));
    }

    // Student: Get reviews received by current logged in user
    @GetMapping("/reviews/my-reviews")
    public ResponseEntity<ApiResponse<List<SessionReviewDTO>>> getMyReceivedReviews(Authentication authentication) {
        List<SessionReviewDTO> reviews = reviewService.getMyReceivedReviews(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("My received reviews loaded", reviews));
    }

    // Public / Student: View reviews received by another peer
    @GetMapping("/reviews/student/{profileId}")
    public ResponseEntity<ApiResponse<List<SessionReviewDTO>>> getStudentReviews(@PathVariable Long profileId) {
        List<SessionReviewDTO> reviews = reviewService.getReviewsByStudentProfileId(profileId);
        return ResponseEntity.ok(ApiResponse.success("Student reviews loaded", reviews));
    }

    // Admin: List all platform reviews for moderation
    @GetMapping("/admin/reviews")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<SessionReviewDTO>>> getAllReviewsForAdmin() {
        List<SessionReviewDTO> reviews = reviewService.getAllReviewsForAdmin();
        return ResponseEntity.ok(ApiResponse.success("All platform reviews loaded for admin", reviews));
    }

    // Admin: Flag or unflag a review
    @PutMapping("/admin/reviews/{id}/flag")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<SessionReviewDTO>> toggleFlagReview(
            @PathVariable Long id,
            @RequestParam(defaultValue = "true") boolean flagged) {
        SessionReviewDTO dto = reviewService.toggleFlagReview(id, flagged);
        return ResponseEntity.ok(ApiResponse.success("Review flag status updated", dto));
    }
}
