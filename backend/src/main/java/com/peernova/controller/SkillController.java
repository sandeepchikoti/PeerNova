package com.peernova.controller;

import com.peernova.dto.AddSkillRequest;
import com.peernova.dto.ApiResponse;
import com.peernova.dto.SkillCategoryDTO;
import com.peernova.dto.StudentSkillDTO;
import com.peernova.service.SkillService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class SkillController {

    @Autowired
    private SkillService skillService;

    @GetMapping("/skills/categories")
    public ResponseEntity<ApiResponse<List<SkillCategoryDTO>>> getSkillCategories() {
        List<SkillCategoryDTO> categories = skillService.getSkillCategories();
        return ResponseEntity.ok(ApiResponse.success("Skill categories retrieved", categories));
    }

    @GetMapping("/student/skills")
    public ResponseEntity<ApiResponse<List<StudentSkillDTO>>> getStudentSkills(Authentication authentication) {
        List<StudentSkillDTO> skills = skillService.getStudentSkills(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Student skills retrieved", skills));
    }

    @PostMapping("/student/skills")
    public ResponseEntity<ApiResponse<StudentSkillDTO>> addStudentSkill(
            Authentication authentication,
            @Valid @RequestBody AddSkillRequest request) {
        StudentSkillDTO created = skillService.addStudentSkill(authentication.getName(), request);
        return ResponseEntity.ok(ApiResponse.success("Skill added successfully", created));
    }

    @DeleteMapping("/student/skills/{skillId}")
    public ResponseEntity<ApiResponse<String>> removeStudentSkill(
            Authentication authentication,
            @PathVariable Long skillId) {
        skillService.removeStudentSkill(authentication.getName(), skillId);
        return ResponseEntity.ok(ApiResponse.success("Skill removed successfully"));
    }
}
