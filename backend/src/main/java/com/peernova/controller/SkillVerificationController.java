package com.peernova.controller;

import com.peernova.dto.*;
import com.peernova.service.SkillVerificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class SkillVerificationController {

    @Autowired
    private SkillVerificationService skillVerificationService;

    // Student: List available skill tests
    @GetMapping("/skill-tests")
    public ResponseEntity<ApiResponse<List<SkillTestDTO>>> getActiveSkillTests(Authentication authentication) {
        List<SkillTestDTO> tests = skillVerificationService.getActiveTests(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Available skill assessment tests loaded", tests));
    }

    // Student: Get test questions to begin exam
    @GetMapping("/skill-tests/{id}")
    public ResponseEntity<ApiResponse<List<TestQuestionDTO>>> getTestQuestions(@PathVariable Long id) {
        List<TestQuestionDTO> questions = skillVerificationService.getTestQuestions(id);
        return ResponseEntity.ok(ApiResponse.success("Test questions loaded", questions));
    }

    // Student: Submit test answers and get graded score & badge
    @PostMapping("/skill-tests/{id}/submit")
    public ResponseEntity<ApiResponse<TestResultDTO>> submitSkillTest(
            @PathVariable Long id,
            @RequestBody SubmitTestRequest request,
            Authentication authentication) {
        TestResultDTO result = skillVerificationService.submitTest(authentication.getName(), id, request);
        return ResponseEntity.ok(ApiResponse.success("Assessment submitted and evaluated", result));
    }

    // Student: View attempt history and scores
    @GetMapping("/skill-tests/my-attempts")
    public ResponseEntity<ApiResponse<List<TestAttemptResponseDTO>>> getMyAttempts(Authentication authentication) {
        List<TestAttemptResponseDTO> attempts = skillVerificationService.getStudentAttempts(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("My test attempts loaded", attempts));
    }

    // Admin: View all student assessment attempts across platform
    @GetMapping("/admin/skill-tests/attempts")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<TestAttemptResponseDTO>>> getAllAttemptsForAdmin() {
        List<TestAttemptResponseDTO> attempts = skillVerificationService.getAllAttemptsForAdmin();
        return ResponseEntity.ok(ApiResponse.success("All student test attempts loaded for admin", attempts));
    }

    // Admin: Manual verify or unverify a student skill
    @PutMapping("/admin/skills/{studentSkillId}/verify")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<StudentSkillDTO>> manualVerifySkill(
            @PathVariable Long studentSkillId,
            @RequestParam(defaultValue = "true") boolean verify) {
        StudentSkillDTO dto = skillVerificationService.manualVerifySkill(studentSkillId, verify);
        return ResponseEntity.ok(ApiResponse.success("Skill verification status updated by admin", dto));
    }
}
