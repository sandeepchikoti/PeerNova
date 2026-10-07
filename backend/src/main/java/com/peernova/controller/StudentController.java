package com.peernova.controller;

import com.peernova.dto.ApiResponse;
import com.peernova.dto.StudentProfileResponse;
import com.peernova.dto.UpdateProfileRequest;
import com.peernova.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/student")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<StudentProfileResponse>> getProfile(Authentication authentication) {
        StudentProfileResponse profile = studentService.getStudentProfile(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Student profile retrieved", profile));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<StudentProfileResponse>> updateProfile(
            Authentication authentication,
            @RequestBody UpdateProfileRequest request) {
        StudentProfileResponse updated = studentService.updateStudentProfile(authentication.getName(), request);
        return ResponseEntity.ok(ApiResponse.success("Student profile updated successfully", updated));
    }

    @GetMapping("/dashboard-summary")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardSummary(Authentication authentication) {
        Map<String, Object> summary = studentService.getDashboardSummary(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Dashboard summary retrieved", summary));
    }
}
