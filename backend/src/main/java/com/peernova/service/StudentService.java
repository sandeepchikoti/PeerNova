package com.peernova.service;

import com.peernova.dto.StudentProfileResponse;
import com.peernova.dto.UpdateProfileRequest;
import com.peernova.entity.StudentProfile;
import com.peernova.entity.User;
import com.peernova.repository.StudentProfileRepository;
import com.peernova.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
public class StudentService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    public StudentProfileResponse getStudentProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        StudentProfile profile = studentProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Student profile not found for user: " + email));

        return mapToResponse(profile);
    }

    @Transactional
    public StudentProfileResponse updateStudentProfile(String email, UpdateProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        if (request.getFullName() != null && !request.getFullName().isBlank()) {
            user.setFullName(request.getFullName().trim());
            userRepository.save(user);
        }

        StudentProfile profile = studentProfileRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    StudentProfile newProfile = new StudentProfile();
                    newProfile.setUser(user);
                    return newProfile;
                });

        if (request.getCollege() != null) profile.setCollege(request.getCollege().trim());
        if (request.getDepartment() != null) profile.setDepartment(request.getDepartment().trim());
        if (request.getYearOfStudy() != null) profile.setYearOfStudy(request.getYearOfStudy().trim());
        if (request.getBio() != null) profile.setBio(request.getBio().trim());

        StudentProfile savedProfile = studentProfileRepository.save(profile);

        return mapToResponse(savedProfile);
    }

    @Autowired
    private com.peernova.repository.StudentSkillRepository studentSkillRepository;

    @Autowired
    private com.peernova.repository.ConnectionRepository connectionRepository;

    public Map<String, Object> getDashboardSummary(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        StudentProfile profile = studentProfileRepository.findByUserId(user.getId())
                .orElse(null);

        long teachingCount = 0;
        long learningCount = 0;
        long activeConnectionsCount = 0;

        if (profile != null) {
            teachingCount = studentSkillRepository.findByStudentProfileIdAndSkillType(profile.getId(), com.peernova.entity.SkillType.TEACH).size();
            learningCount = studentSkillRepository.findByStudentProfileIdAndSkillType(profile.getId(), com.peernova.entity.SkillType.LEARN).size();
            activeConnectionsCount = connectionRepository.countActiveConnectionsForProfile(profile.getId());
        }

        Map<String, Object> summary = new HashMap<>();
        summary.put("userId", user.getId());
        summary.put("fullName", user.getFullName());
        summary.put("email", user.getEmail());
        summary.put("role", user.getRole());
        summary.put("verificationStatus", profile != null ? profile.getVerificationStatus() : "PENDING");
        summary.put("college", profile != null ? profile.getCollege() : "");
        summary.put("department", profile != null ? profile.getDepartment() : "");
        summary.put("yearOfStudy", profile != null ? profile.getYearOfStudy() : "");
        summary.put("teachingSkillsCount", teachingCount);
        summary.put("learningSkillsCount", learningCount);
        summary.put("activeConnectionsCount", activeConnectionsCount);

        return summary;
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
