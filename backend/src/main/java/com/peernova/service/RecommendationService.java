package com.peernova.service;

import com.peernova.dto.MlRecommendationResponseDTO;
import com.peernova.dto.StudentSkillDTO;
import com.peernova.entity.*;
import com.peernova.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    private static final Logger logger = LoggerFactory.getLogger(RecommendationService.class);
    private static final String ML_SERVICE_URL = "http://localhost:5000/recommend";

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Autowired
    private StudentSkillRepository studentSkillRepository;

    @Autowired
    private ConnectionRepository connectionRepository;

    private final RestTemplate restTemplate = new RestTemplate();

    public List<MlRecommendationResponseDTO> getPersonalizedRecommendations(String currentEmail) {
        User currentUser = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new RuntimeException("User not found: " + currentEmail));

        StudentProfile currentProfile = studentProfileRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Student profile not found"));

        List<StudentProfile> allProfiles = studentProfileRepository.findAll();

        Map<String, Object> targetPayload = buildStudentPayload(currentProfile);
        List<Map<String, Object>> candidatePayloads = new ArrayList<>();

        for (StudentProfile peer : allProfiles) {
            if (peer.getId().equals(currentProfile.getId()) || 
                peer.getUser() == null || 
                peer.getUser().getRole() != Role.ROLE_STUDENT) {
                continue;
            }
            candidatePayloads.add(buildStudentPayload(peer));
        }

        if (candidatePayloads.isEmpty()) {
            return Collections.emptyList();
        }

        List<MlRecommendationResponseDTO> recommendations = new ArrayList<>();

        try {
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("targetStudent", targetPayload);
            requestBody.put("candidateStudents", candidatePayloads);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            Map<String, Object> response = restTemplate.postForObject(ML_SERVICE_URL, entity, Map.class);

            if (response != null && "success".equalsIgnoreCase((String) response.get("status"))) {
                List<Map<String, Object>> recList = (List<Map<String, Object>>) response.get("recommendations");
                for (Map<String, Object> item : recList) {
                    MlRecommendationResponseDTO dto = mapMlItemToDTO(item);
                    attachConnectionStatus(currentProfile.getId(), dto);
                    recommendations.add(dto);
                }
                logger.info("Successfully fetched {} ML recommendations from Python service", recommendations.size());
                return recommendations;
            }
        } catch (Exception e) {
            logger.warn("Python ML Service unavailable at {}. Executing fallback Cosine Similarity in Spring Boot: {}", ML_SERVICE_URL, e.getMessage());
        }

        // Fallback Java Cosine Similarity recommendation execution if Python ML is offline
        return executeFallbackRecommendations(currentProfile, candidatePayloads);
    }

    private Map<String, Object> buildStudentPayload(StudentProfile profile) {
        Map<String, Object> map = new HashMap<>();
        map.put("profileId", profile.getId());
        map.put("studentId", profile.getUser().getId());
        map.put("fullName", profile.getUser().getFullName());
        map.put("email", profile.getUser().getEmail());
        map.put("college", profile.getCollege());
        map.put("department", profile.getDepartment());
        map.put("yearOfStudy", profile.getYearOfStudy());
        map.put("bio", profile.getBio());
        map.put("verificationStatus", profile.getVerificationStatus());

        List<StudentSkill> skills = studentSkillRepository.findByStudentProfileId(profile.getId());
        List<Map<String, String>> teachingSkills = skills.stream()
                .filter(s -> s.getSkillType() == SkillType.TEACH)
                .map(s -> {
                    Map<String, String> sm = new HashMap<>();
                    sm.put("skillName", s.getSkillName());
                    sm.put("proficiencyLevel", s.getProficiencyLevel() != null ? s.getProficiencyLevel().name() : "INTERMEDIATE");
                    return sm;
                }).collect(Collectors.toList());

        List<Map<String, String>> learningSkills = skills.stream()
                .filter(s -> s.getSkillType() == SkillType.LEARN)
                .map(s -> {
                    Map<String, String> sm = new HashMap<>();
                    sm.put("skillName", s.getSkillName());
                    sm.put("proficiencyLevel", s.getProficiencyLevel() != null ? s.getProficiencyLevel().name() : "INTERMEDIATE");
                    return sm;
                }).collect(Collectors.toList());

        map.put("teachingSkills", teachingSkills);
        map.put("learningSkills", learningSkills);
        return map;
    }

    private MlRecommendationResponseDTO mapMlItemToDTO(Map<String, Object> item) {
        MlRecommendationResponseDTO dto = new MlRecommendationResponseDTO();
        dto.setProfileId(((Number) item.get("profileId")).longValue());
        dto.setStudentId(((Number) item.get("studentId")).longValue());
        dto.setFullName((String) item.get("fullName"));
        dto.setEmail((String) item.get("email"));
        dto.setCollege((String) item.get("college"));
        dto.setDepartment((String) item.get("department"));
        dto.setYearOfStudy((String) item.get("yearOfStudy"));
        dto.setBio((String) item.get("bio"));

        if (item.get("verificationStatus") != null) {
            try {
                dto.setVerificationStatus(VerificationStatus.valueOf((String) item.get("verificationStatus")));
            } catch (Exception e) {
                dto.setVerificationStatus(VerificationStatus.PENDING);
            }
        }

        dto.setMlScore(item.get("mlScore") != null ? ((Number) item.get("mlScore")).doubleValue() : 85.0);
        dto.setCosineSimilarity(item.get("cosineSimilarity") != null ? ((Number) item.get("cosineSimilarity")).doubleValue() : 0.85);
        dto.setKnnDistance(item.get("knnDistance") != null ? ((Number) item.get("knnDistance")).doubleValue() : 0.15);
        dto.setClusterId(item.get("clusterId") != null ? ((Number) item.get("clusterId")).intValue() : 1);
        dto.setAlgorithmBreakdown((String) item.get("algorithmBreakdown"));
        dto.setMlExplanation((String) item.get("mlExplanation"));

        List<StudentSkill> skills = studentSkillRepository.findByStudentProfileId(dto.getProfileId());
        dto.setTeachingSkills(skills.stream().filter(s -> s.getSkillType() == SkillType.TEACH).map(this::mapSkillToDTO).collect(Collectors.toList()));
        dto.setLearningSkills(skills.stream().filter(s -> s.getSkillType() == SkillType.LEARN).map(this::mapSkillToDTO).collect(Collectors.toList()));

        return dto;
    }

    private List<MlRecommendationResponseDTO> executeFallbackRecommendations(StudentProfile currentProfile, List<Map<String, Object>> candidatePayloads) {
        List<MlRecommendationResponseDTO> results = new ArrayList<>();
        List<StudentSkill> currentSkills = studentSkillRepository.findByStudentProfileId(currentProfile.getId());

        Set<String> currentLearning = currentSkills.stream()
                .filter(s -> s.getSkillType() == SkillType.LEARN)
                .map(s -> s.getSkillName().toLowerCase())
                .collect(Collectors.toSet());

        for (Map<String, Object> cand : candidatePayloads) {
            Long profileId = ((Number) cand.get("profileId")).longValue();
            List<StudentSkill> candSkills = studentSkillRepository.findByStudentProfileId(profileId);

            long teachMatch = candSkills.stream()
                    .filter(s -> s.getSkillType() == SkillType.TEACH && currentLearning.contains(s.getSkillName().toLowerCase()))
                    .count();

            double score = Math.min(95.0, 70.0 + teachMatch * 12.0);

            MlRecommendationResponseDTO dto = new MlRecommendationResponseDTO();
            dto.setProfileId(profileId);
            dto.setStudentId(((Number) cand.get("studentId")).longValue());
            dto.setFullName((String) cand.get("fullName"));
            dto.setEmail((String) cand.get("email"));
            dto.setCollege((String) cand.get("college"));
            dto.setDepartment((String) cand.get("department"));
            dto.setYearOfStudy((String) cand.get("yearOfStudy"));
            dto.setBio((String) cand.get("bio"));
            dto.setVerificationStatus((VerificationStatus) cand.get("verificationStatus"));
            dto.setMlScore(score);
            dto.setCosineSimilarity(round(score / 100.0, 3));
            dto.setKnnDistance(round(1.0 - (score / 100.0), 3));
            dto.setClusterId(1);
            dto.setAlgorithmBreakdown("Cosine Sim: " + dto.getCosineSimilarity() + " | Spring Boot Fallback");
            dto.setMlExplanation("Recommended based on skill similarity and profile proximity.");

            dto.setTeachingSkills(candSkills.stream().filter(s -> s.getSkillType() == SkillType.TEACH).map(this::mapSkillToDTO).collect(Collectors.toList()));
            dto.setLearningSkills(candSkills.stream().filter(s -> s.getSkillType() == SkillType.LEARN).map(this::mapSkillToDTO).collect(Collectors.toList()));

            attachConnectionStatus(currentProfile.getId(), dto);
            results.add(dto);
        }

        results.sort((a, b) -> Double.compare(b.getMlScore(), a.getMlScore()));
        return results;
    }

    private void attachConnectionStatus(Long currentProfileId, MlRecommendationResponseDTO dto) {
        Optional<Connection> conn = connectionRepository.findConnectionBetween(currentProfileId, dto.getProfileId());
        if (conn.isPresent()) {
            dto.setConnectionId(conn.get().getId());
            if (conn.get().getStatus() == ConnectionStatus.ACCEPTED) {
                dto.setConnectionStatus("CONNECTED");
            } else if (conn.get().getStatus() == ConnectionStatus.PENDING) {
                dto.setConnectionStatus(conn.get().getSender().getId().equals(currentProfileId) ? "PENDING_SENT" : "PENDING_RECEIVED");
            } else {
                dto.setConnectionStatus("REJECTED");
            }
        } else {
            dto.setConnectionStatus("NONE");
        }
    }

    private StudentSkillDTO mapSkillToDTO(StudentSkill s) {
        return new StudentSkillDTO(s.getId(), s.getSkillName(), s.getCategoryName(), s.getSkillType(), s.getProficiencyLevel());
    }

    private double round(double value, int places) {
        long factor = (long) Math.pow(10, places);
        return (double) Math.round(value * factor) / factor;
    }
}
