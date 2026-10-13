package com.peernova.controller;

import com.peernova.dto.ApiResponse;
import com.peernova.dto.CertificateDTO;
import com.peernova.service.CertificateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CertificateController {

    @Autowired
    private CertificateService certificateService;

    // Student: Get my earned certificates
    @GetMapping("/certificates/my-certificates")
    public ResponseEntity<ApiResponse<List<CertificateDTO>>> getMyCertificates(Authentication authentication) {
        List<CertificateDTO> certificates = certificateService.getMyCertificates(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Certificates loaded successfully", certificates));
    }

    // Public / Student: View certificate by ID
    @GetMapping("/certificates/{id}")
    public ResponseEntity<ApiResponse<CertificateDTO>> getCertificateById(@PathVariable Long id) {
        CertificateDTO dto = certificateService.getCertificateById(id);
        return ResponseEntity.ok(ApiResponse.success("Certificate details loaded", dto));
    }

    // Public: Verify certificate authenticity by unique code
    @GetMapping("/certificates/verify/{code}")
    public ResponseEntity<ApiResponse<CertificateDTO>> verifyCertificate(@PathVariable String code) {
        CertificateDTO dto = certificateService.verifyCertificate(code);
        return ResponseEntity.ok(ApiResponse.success("Certificate verified successfully", dto));
    }

    // Student: Generate certificate for passed skill test attempt
    @PostMapping("/certificates/generate/skill/{attemptId}")
    public ResponseEntity<ApiResponse<CertificateDTO>> generateSkillCertificate(
            @PathVariable Long attemptId,
            Authentication authentication) {
        CertificateDTO dto = certificateService.generateCertificateForSkillTest(authentication.getName(), attemptId);
        return ResponseEntity.ok(ApiResponse.success("Skill competency certificate generated successfully", dto));
    }

    // Student: Generate certificate for completed learning session
    @PostMapping("/certificates/generate/session/{sessionId}")
    public ResponseEntity<ApiResponse<CertificateDTO>> generateSessionCertificate(
            @PathVariable Long sessionId,
            Authentication authentication) {
        CertificateDTO dto = certificateService.generateCertificateForSession(authentication.getName(), sessionId);
        return ResponseEntity.ok(ApiResponse.success("Session completion certificate generated successfully", dto));
    }

    // Admin: List all certificates across the platform
    @GetMapping("/admin/certificates")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<CertificateDTO>>> getAllCertificatesForAdmin() {
        List<CertificateDTO> certificates = certificateService.getAllCertificatesForAdmin();
        return ResponseEntity.ok(ApiResponse.success("All platform certificates loaded for admin", certificates));
    }
}
