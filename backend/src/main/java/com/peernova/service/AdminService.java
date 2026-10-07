package com.peernova.service;

import com.peernova.dto.AdminDashboardStatsResponse;
import com.peernova.dto.StudentProfileResponse;
import com.peernova.dto.VerifyProfileRequest;
import com.peernova.entity.Role;
import com.peernova.entity.StudentProfile;
import com.peernova.entity.User;
import com.peernova.entity.VerificationStatus;
import com.peernova.repository.StudentProfileRepository;
import com.peernova.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    public AdminDashboardStatsResponse getDashboardStats() {
        long totalStudents = userRepository.countByRole(Role.ROLE_STUDENT);
        long pendingVerifications = studentProfileRepository.countByVerificationStatus(VerificationStatus.PENDING);
        long approvedStudents = studentProfileRepository.countByVerificationStatus(VerificationStatus.VERIFIED) 
                               + studentProfileRepository.countByVerificationStatus(VerificationStatus.APPROVED);
        long rejectedStudents = studentProfileRepository.countByVerificationStatus(VerificationStatus.REJECTED);

        return new AdminDashboardStatsResponse(
                totalStudents,
                pendingVerifications,
                approvedStudents,
                rejectedStudents
        );
    }

    public List<StudentProfileResponse> getAllStudents(String search, String statusFilter) {
        List<StudentProfile> profiles;

        if (search != null && !search.isBlank()) {
            profiles = studentProfileRepository.searchProfiles(search.trim());
        } else if (statusFilter != null && !statusFilter.isBlank() && !statusFilter.equalsIgnoreCase("ALL")) {
            try {
                VerificationStatus status = VerificationStatus.valueOf(statusFilter.toUpperCase());
                profiles = studentProfileRepository.findByVerificationStatus(status);
            } catch (IllegalArgumentException e) {
                profiles = studentProfileRepository.findAll();
            }
        } else {
            profiles = studentProfileRepository.findAll();
        }

        return profiles.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public StudentProfileResponse getStudentProfileById(Long id) {
        StudentProfile profile = studentProfileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student profile not found with ID: " + id));

        return mapToResponse(profile);
    }

    @Transactional
    public StudentProfileResponse verifyStudentProfile(Long id, VerifyProfileRequest request) {
        StudentProfile profile = studentProfileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student profile not found with ID: " + id));

        profile.setVerificationStatus(request.getStatus());
        StudentProfile updated = studentProfileRepository.save(profile);

        return mapToResponse(updated);
    }

    private StudentProfileResponse mapToResponse(StudentProfile profile) {
        StudentProfileResponse response = new StudentProfileResponse();
        response.setId(profile.getId());
        response.setUserId(profile.getUser().getId());
        response.setFullName(profile.getUser().getFullName());
        response.setEmail(profile.getUser().getEmail());
        response.setRole(profile.getUser().getRole());
        response.setCollege(profile.getCollege());
        response.setDepartment(profile.getDepartment());
        response.setYearOfStudy(profile.getYearOfStudy());
        response.setBio(profile.getBio());
        response.setVerificationStatus(profile.getVerificationStatus());
        response.setCreatedAt(profile.getCreatedAt());
        response.setUpdatedAt(profile.getUpdatedAt());
        return response;
    }
}
