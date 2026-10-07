package com.peernova.controller;

import com.peernova.dto.ApiResponse;
import com.peernova.dto.MlRecommendationResponseDTO;
import com.peernova.service.RecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    @Autowired
    private RecommendationService recommendationService;

    @GetMapping("/personalized")
    public ResponseEntity<ApiResponse<List<MlRecommendationResponseDTO>>> getPersonalizedRecommendations(Authentication authentication) {
        List<MlRecommendationResponseDTO> recommendations = recommendationService.getPersonalizedRecommendations(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("AI/ML personalized peer recommendations calculated successfully", recommendations));
    }
}
