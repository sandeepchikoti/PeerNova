package com.peernova.controller;

import com.peernova.dto.AdminDashboardStatsResponse;
import com.peernova.dto.ApiResponse;
import com.peernova.dto.StudentProfileResponse;
import com.peernova.dto.VerifyProfileRequest;
import com.peernova.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/dashboard-stats")
    public ResponseEntity<ApiResponse<AdminDashboardStatsResponse>> getDashboardStats() {
        AdminDashboardStatsResponse stats = adminService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success("Admin stats retrieved", stats));
    }

    @GetMapping("/students")
    public ResponseEntity<ApiResponse<List<StudentProfileResponse>>> getAllStudents(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status) {
        List<StudentProfileResponse> students = adminService.getAllStudents(search, status);
        return ResponseEntity.ok(ApiResponse.success("Students retrieved", students));
    }

    @GetMapping("/students/{id}")
    public ResponseEntity<ApiResponse<StudentProfileResponse>> getStudentById(@PathVariable Long id) {
        StudentProfileResponse student = adminService.getStudentProfileById(id);
        return ResponseEntity.ok(ApiResponse.success("Student details retrieved", student));
    }

    @PutMapping("/students/{id}/verify")
    public ResponseEntity<ApiResponse<StudentProfileResponse>> verifyStudentProfile(
            @PathVariable Long id,
            @Valid @RequestBody VerifyProfileRequest request) {
        StudentProfileResponse updated = adminService.verifyStudentProfile(id, request);
        return ResponseEntity.ok(ApiResponse.success("Student profile status updated to " + request.getStatus(), updated));
    }
}
