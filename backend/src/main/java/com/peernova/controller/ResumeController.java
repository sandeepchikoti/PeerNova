package com.peernova.controller;

import com.peernova.dto.*;
import com.peernova.service.GeminiService;
import com.peernova.service.ResumeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/resume")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ResumeController {

    @Autowired
    private ResumeService resumeService;

    @Autowired
    private GeminiService geminiService;

    @GetMapping("/my-resume")
    public ResponseEntity<ResumeDTO> getMyResume(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(resumeService.getResumeByEmail(email));
    }

    @PostMapping("/save")
    public ResponseEntity<ResumeDTO> saveResume(@RequestBody ResumeDTO resumeDTO, Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(resumeService.saveResumeByEmail(email, resumeDTO));
    }

    @PostMapping("/sync-credentials")
    public ResponseEntity<ResumeDTO> syncCredentials(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(resumeService.syncPeerNovaCredentials(email));
    }

    @PostMapping("/ai/improve")
    public ResponseEntity<GeminiImprovementResponse> improveContent(@RequestBody GeminiImprovementRequest request) {
        return ResponseEntity.ok(geminiService.improveContent(request));
    }

    @PostMapping("/ai/skill-assistance")
    public ResponseEntity<SkillAssistanceResponse> generateSkillAssistance(@RequestBody SkillAssistanceRequest request) {
        return ResponseEntity.ok(geminiService.generateSkillAssistance(request));
    }

    @PostMapping("/ai/learning-suggestions")
    public ResponseEntity<LearningRoadmapResponse> generateLearningSuggestions(@RequestBody LearningSuggestionRequest request) {
        return ResponseEntity.ok(geminiService.generateLearningSuggestions(request));
    }

    @PostMapping("/ai/ats-review")
    public ResponseEntity<AtsReviewResponse> reviewResumeAts(@RequestBody ResumeDTO resumeDTO) {
        return ResponseEntity.ok(geminiService.reviewResumeAts(resumeDTO));
    }
}
