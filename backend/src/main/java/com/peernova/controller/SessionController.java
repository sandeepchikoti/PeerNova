package com.peernova.controller;

import com.peernova.dto.*;
import com.peernova.service.SessionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sessions")
public class SessionController {

    @Autowired
    private SessionService sessionService;

    @PostMapping("/request")
    public ResponseEntity<ApiResponse<LearningSessionResponseDTO>> createSession(
            @Valid @RequestBody CreateSessionRequest request,
            Authentication authentication) {
        LearningSessionResponseDTO dto = sessionService.createSession(authentication.getName(), request);
        return ResponseEntity.ok(ApiResponse.success("Learning session requested successfully", dto));
    }

    @GetMapping("/my-sessions")
    public ResponseEntity<ApiResponse<List<LearningSessionResponseDTO>>> getMySessions(Authentication authentication) {
        List<LearningSessionResponseDTO> sessions = sessionService.getMySessions(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("User learning sessions loaded", sessions));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<LearningSessionResponseDTO>> getSessionById(
            @PathVariable Long id,
            Authentication authentication) {
        LearningSessionResponseDTO dto = sessionService.getSessionById(authentication.getName(), id);
        return ResponseEntity.ok(ApiResponse.success("Session details retrieved", dto));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<LearningSessionResponseDTO>> updateSessionStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateSessionStatusRequest request,
            Authentication authentication) {
        LearningSessionResponseDTO dto = sessionService.updateSessionStatus(authentication.getName(), id, request);
        return ResponseEntity.ok(ApiResponse.success("Session status updated successfully", dto));
    }

    @PostMapping("/{id}/attendance")
    public ResponseEntity<ApiResponse<SessionAttendanceDTO>> markAttendance(
            @PathVariable Long id,
            @RequestBody(required = false) MarkAttendanceRequest request,
            Authentication authentication) {
        if (request == null) {
            request = new MarkAttendanceRequest();
        }
        SessionAttendanceDTO dto = sessionService.markAttendance(authentication.getName(), id, request);
        return ResponseEntity.ok(ApiResponse.success("Session attendance recorded successfully", dto));
    }

    @GetMapping("/{id}/attendance")
    public ResponseEntity<ApiResponse<List<SessionAttendanceDTO>>> getSessionAttendances(@PathVariable Long id) {
        List<SessionAttendanceDTO> attendances = sessionService.getSessionAttendances(id);
        return ResponseEntity.ok(ApiResponse.success("Session attendances retrieved", attendances));
    }

    @GetMapping("/attendance-history")
    public ResponseEntity<ApiResponse<List<SessionAttendanceDTO>>> getMyAttendanceHistory(Authentication authentication) {
        List<SessionAttendanceDTO> history = sessionService.getMyAttendanceHistory(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Attendance history loaded", history));
    }
}
