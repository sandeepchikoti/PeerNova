package com.peernova.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.peernova.dto.*;
import com.peernova.entity.*;
import com.peernova.exception.ResourceNotFoundException;
import com.peernova.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ResumeService {

    private static final Logger log = LoggerFactory.getLogger(ResumeService.class);

    @Autowired
    private StudentResumeRepository studentResumeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Autowired
    private StudentSkillRepository studentSkillRepository;

    @Autowired
    private TestAttemptRepository testAttemptRepository;

    @Autowired
    private CertificateRepository certificateRepository;

    @Autowired
    private LearningSessionRepository learningSessionRepository;

    @Autowired
    private GeminiService geminiService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Transactional
    public ResumeDTO getResumeByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        StudentProfile profile = studentProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for user: " + email));

        StudentResume resume = studentResumeRepository.findByUser(user)
                .orElseGet(() -> createInitialResume(user, profile));

        return toDto(resume, user, profile);
    }

    @Transactional
    public ResumeDTO saveResumeByEmail(String email, ResumeDTO dto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        StudentProfile profile = studentProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for user: " + email));

        StudentResume resume = studentResumeRepository.findByUser(user)
                .orElseGet(() -> new StudentResume(user));

        resume.setHeadline(dto.getHeadline());
        resume.setSummary(dto.getSummary());
        resume.setPhone(dto.getPhone());
        resume.setLocation(dto.getLocation());
        resume.setLinkedinUrl(dto.getLinkedinUrl());
        resume.setGithubUrl(dto.getGithubUrl());
        resume.setPortfolioUrl(dto.getPortfolioUrl());
        resume.setTargetRole(dto.getTargetRole());
        resume.setSelectedTemplate(dto.getSelectedTemplate() != null ? dto.getSelectedTemplate() : "MODERN");
        resume.setIncludePeerNovaMetrics(dto.getIncludePeerNovaMetrics() != null ? dto.getIncludePeerNovaMetrics() : true);

        try {
            resume.setEducationJson(objectMapper.writeValueAsString(dto.getEducation()));
            resume.setExperienceJson(objectMapper.writeValueAsString(dto.getExperience()));
            resume.setProjectsJson(objectMapper.writeValueAsString(dto.getProjects()));
            resume.setSkillsJson(objectMapper.writeValueAsString(dto.getSkillCategories()));
            resume.setCertificationsJson(objectMapper.writeValueAsString(dto.getCertifications()));
            resume.setAchievementsJson(objectMapper.writeValueAsString(dto.getAchievements()));
        } catch (Exception e) {
            log.error("Failed to serialize resume sections to JSON: {}", e.getMessage());
        }

        AtsReviewResponse review = geminiService.reviewResumeAts(dto);
        resume.setAtsScore(review.getOverallScore());
        resume.setAtsFeedback(review.getSummaryFeedback());

        resume = studentResumeRepository.save(resume);
        return toDto(resume, user, profile);
    }

    @Transactional
    public ResumeDTO syncPeerNovaCredentials(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        StudentProfile profile = studentProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for user: " + email));

        ResumeDTO dto = getResumeByEmail(email);

        // 1. Pull Phase 8 Certificates
        List<Certificate> certs = certificateRepository.findByRecipientIdOrderByIssuedAtDesc(profile.getId());
        List<CertificationItem> currentCerts = dto.getCertifications() != null ? new ArrayList<>(dto.getCertifications()) : new ArrayList<>();

        for (Certificate cert : certs) {
            boolean exists = currentCerts.stream().anyMatch(c -> cert.getCertificateNumber().equals(c.getVerificationId()));
            if (!exists) {
                currentCerts.add(new CertificationItem(
                        cert.getTitle(),
                        "PeerNova Academic Ecosystem",
                        cert.getIssuedAt() != null ? cert.getIssuedAt().toLocalDate().toString() : "2026",
                        "http://localhost:5173/verify-certificate?code=" + cert.getVerificationCode(),
                        cert.getCertificateNumber(),
                        true
                ));
            }
        }
        dto.setCertifications(currentCerts);

        // 2. Pull Phase 7 Verified Skills Badges
        List<TestAttempt> passedAttempts = testAttemptRepository.findByStudentIdOrderByAttemptedAtDesc(profile.getId())
                .stream().filter(TestAttempt::isPassed).collect(Collectors.toList());

        List<String> verifiedSkillNames = passedAttempts.stream()
                .map(a -> a.getTest().getSkillName() + " [Verified]")
                .distinct()
                .collect(Collectors.toList());

        List<SkillCategoryItem> skillCategories = dto.getSkillCategories() != null ? new ArrayList<>(dto.getSkillCategories()) : new ArrayList<>();
        Optional<SkillCategoryItem> verifiedCategoryOpt = skillCategories.stream()
                .filter(cat -> "PeerNova Verified Competencies".equalsIgnoreCase(cat.getCategory()))
                .findFirst();

        if (verifiedCategoryOpt.isPresent()) {
            verifiedCategoryOpt.get().setSkills(verifiedSkillNames);
        } else if (!verifiedSkillNames.isEmpty()) {
            skillCategories.add(0, new SkillCategoryItem("PeerNova Verified Competencies", verifiedSkillNames));
        }
        dto.setSkillCategories(skillCategories);

        return saveResumeByEmail(email, dto);
    }

    // -------------------------------------------------------------------------
    // Helper: Initial Resume Auto-population from StudentProfile & PeerNova
    // -------------------------------------------------------------------------
    private StudentResume createInitialResume(User user, StudentProfile profile) {
        StudentResume resume = new StudentResume(user);
        resume.setHeadline("Computer Science Student & Peer Tutor | Aspiring Software Engineer");
        resume.setSummary("Motivated and detail-oriented Computer Science scholar at " +
                (profile.getCollege() != null ? profile.getCollege() : "Engineering University") +
                ". Proficient in full-stack architecture, clean code standards, and agile collaboration. " +
                "Active mentor on the PeerNova ecosystem guiding fellow peers in modern software engineering.");
        resume.setLocation(profile.getCollege() != null ? profile.getCollege() : "Hyderabad, India");
        resume.setTargetRole("Full Stack Software Engineer");
        resume.setSelectedTemplate("MODERN");
        resume.setIncludePeerNovaMetrics(true);
        resume.setAtsScore(85);

        try {
            // Education
            List<EducationItem> eduList = List.of(
                    new EducationItem(
                            "Bachelor of Technology (B.Tech)",
                            profile.getCollege() != null ? profile.getCollege() : "Engineering College",
                            profile.getDepartment() != null ? profile.getDepartment() : "Computer Science and Engineering",
                            "2022",
                            "2026",
                            "8.8 CGPA"
                    )
            );
            resume.setEducationJson(objectMapper.writeValueAsString(eduList));

            // Experience
            List<ExperienceItem> expList = new ArrayList<>();
            ExperienceItem peerTutorExp = new ExperienceItem();
            peerTutorExp.setRole("Peer Technical Mentor & Tutor");
            peerTutorExp.setOrganization("PeerNova Academic Ecosystem");
            peerTutorExp.setLocation("Campus");
            peerTutorExp.setStartDate("Aug 2025");
            peerTutorExp.setEndDate("Present");
            peerTutorExp.setCurrent(true);
            peerTutorExp.setDescription("Mentored fellow engineering students through 1-on-1 and interactive group code review sessions.");
            peerTutorExp.setHighlights(List.of(
                    "Conducted interactive peer learning sessions on data structures, algorithms, and full-stack web development.",
                    "Achieved a 5.0/5.0 student satisfaction rating and verified competency badges across foundational CS topics.",
                    "Authored reusable study roadmaps and guided peers through debugging complex distributed web services."
            ));
            expList.add(peerTutorExp);
            resume.setExperienceJson(objectMapper.writeValueAsString(expList));

            // Projects
            List<ProjectItem> projList = new ArrayList<>();
            ProjectItem p1 = new ProjectItem();
            p1.setTitle("PeerNova: Intelligent Skill Sharing Ecosystem");
            p1.setTechStack("React.js, Spring Boot, MySQL, Python Scikit-Learn, WebSockets");
            p1.setGithubUrl("https://github.com/peernova/ecosystem");
            p1.setLiveUrl("http://localhost:5173");
            p1.setDescription("Enterprise student-to-student skill exchange and collaborative mentorship platform.");
            p1.setHighlights(List.of(
                    "Architected high-throughput REST APIs and JWT security filters handling role-based student access.",
                    "Implemented real-time bidirectional messaging and WebRTC video rooms for interactive peer tutoring.",
                    "Engineered Scikit-Learn ML compatibility matcher using Cosine Similarity and K-Nearest Neighbors."
            ));
            projList.add(p1);
            resume.setProjectsJson(objectMapper.writeValueAsString(projList));

            // Skills from StudentSkill table
            List<StudentSkill> skills = studentSkillRepository.findByStudentProfileId(profile.getId());
            List<String> teaching = skills.stream()
                    .filter(s -> s.getSkillType() == SkillType.TEACH)
                    .map(StudentSkill::getSkillName).collect(Collectors.toList());
            List<String> learning = skills.stream()
                    .filter(s -> s.getSkillType() == SkillType.LEARN)
                    .map(StudentSkill::getSkillName).collect(Collectors.toList());

            List<SkillCategoryItem> skillCats = new ArrayList<>();
            if (!teaching.isEmpty()) skillCats.add(new SkillCategoryItem("Teaching Skills", teaching));
            if (!learning.isEmpty()) skillCats.add(new SkillCategoryItem("Learning & Growth", learning));
            if (skillCats.isEmpty()) {
                skillCats.add(new SkillCategoryItem("Technical Skills", List.of("Java", "Spring Boot", "React.js", "MySQL", "Git")));
            }
            resume.setSkillsJson(objectMapper.writeValueAsString(skillCats));

            // Certifications
            resume.setCertificationsJson(objectMapper.writeValueAsString(new ArrayList<CertificationItem>()));
            // Achievements
            resume.setAchievementsJson(objectMapper.writeValueAsString(List.of(
                    new AchievementItem("Smart India Hackathon Finalist", "Recognized for innovative collaborative campus learning solutions.", "2025")
            )));

        } catch (Exception e) {
            log.error("Failed to construct initial resume JSON: {}", e.getMessage());
        }

        return studentResumeRepository.save(resume);
    }

    private ResumeDTO toDto(StudentResume resume, User user, StudentProfile profile) {
        ResumeDTO dto = new ResumeDTO();
        dto.setId(resume.getId());
        dto.setUserId(user.getId());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setHeadline(resume.getHeadline());
        dto.setSummary(resume.getSummary());
        dto.setPhone(resume.getPhone());
        dto.setLocation(resume.getLocation());
        dto.setLinkedinUrl(resume.getLinkedinUrl());
        dto.setGithubUrl(resume.getGithubUrl());
        dto.setPortfolioUrl(resume.getPortfolioUrl());
        dto.setTargetRole(resume.getTargetRole());
        dto.setSelectedTemplate(resume.getSelectedTemplate() != null ? resume.getSelectedTemplate() : "MODERN");
        dto.setIncludePeerNovaMetrics(resume.getIncludePeerNovaMetrics());
        dto.setAtsScore(resume.getAtsScore() != null ? resume.getAtsScore() : 80);
        dto.setAtsFeedback(resume.getAtsFeedback());
        dto.setUpdatedAt(resume.getUpdatedAt());

        try {
            if (resume.getEducationJson() != null && !resume.getEducationJson().isBlank()) {
                dto.setEducation(objectMapper.readValue(resume.getEducationJson(), new TypeReference<List<EducationItem>>() {}));
            }
            if (resume.getExperienceJson() != null && !resume.getExperienceJson().isBlank()) {
                dto.setExperience(objectMapper.readValue(resume.getExperienceJson(), new TypeReference<List<ExperienceItem>>() {}));
            }
            if (resume.getProjectsJson() != null && !resume.getProjectsJson().isBlank()) {
                dto.setProjects(objectMapper.readValue(resume.getProjectsJson(), new TypeReference<List<ProjectItem>>() {}));
            }
            if (resume.getSkillsJson() != null && !resume.getSkillsJson().isBlank()) {
                dto.setSkillCategories(objectMapper.readValue(resume.getSkillsJson(), new TypeReference<List<SkillCategoryItem>>() {}));
            }
            if (resume.getCertificationsJson() != null && !resume.getCertificationsJson().isBlank()) {
                dto.setCertifications(objectMapper.readValue(resume.getCertificationsJson(), new TypeReference<List<CertificationItem>>() {}));
            }
            if (resume.getAchievementsJson() != null && !resume.getAchievementsJson().isBlank()) {
                dto.setAchievements(objectMapper.readValue(resume.getAchievementsJson(), new TypeReference<List<AchievementItem>>() {}));
            }
        } catch (Exception e) {
            log.error("Failed to parse resume JSON fields: {}", e.getMessage());
        }

        // Real-Time PeerNova Ecosystem Metrics
        dto.setPeerRating(profile.getAverageRating() != null ? profile.getAverageRating() : 0.0);
        dto.setTotalReviews(profile.getTotalReviews() != null ? profile.getTotalReviews() : 0);
        dto.setCompletedSessionsCount((int) learningSessionRepository.countCompletedByStudentProfileId(profile.getId()));
        dto.setVerifiedSkillsCount((int) testAttemptRepository.countByStudentIdAndIsPassedTrue(profile.getId()));

        List<TestAttempt> passedAttempts = testAttemptRepository.findByStudentIdOrderByAttemptedAtDesc(profile.getId())
                .stream().filter(TestAttempt::isPassed).collect(Collectors.toList());
        dto.setVerifiedSkillBadges(passedAttempts.stream()
                .map(a -> a.getTest().getSkillName())
                .distinct().collect(Collectors.toList()));

        dto.setPeerNovaCertificates(certificateRepository.findByRecipientIdOrderByIssuedAtDesc(profile.getId()).stream()
                .map(CertificateDTO::fromEntity)
                .collect(Collectors.toList()));

        return dto;
    }
}
