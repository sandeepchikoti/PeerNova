package com.peernova.controller;

import com.peernova.dto.ApiResponse;
import com.peernova.dto.SkillMatchResponseDTO;
import com.peernova.service.MatchingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matching")
public class MatchingController {

    @Autowired
    private MatchingService matchingService;

    @GetMapping("/peers")
    public ResponseEntity<ApiResponse<List<SkillMatchResponseDTO>>> getSkillMatches(Authentication authentication) {
        List<SkillMatchResponseDTO> matches = matchingService.getSkillMatches(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Skill matches calculated", matches));
    }
}
