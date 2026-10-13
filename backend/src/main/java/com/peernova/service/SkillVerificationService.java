package com.peernova.service;

import com.peernova.dto.*;
import com.peernova.entity.*;
import com.peernova.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class SkillVerificationService {

    private static final Logger logger = LoggerFactory.getLogger(SkillVerificationService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Autowired
    private StudentSkillRepository studentSkillRepository;

    @Autowired
    private SkillTestRepository skillTestRepository;

    @Autowired
    private TestQuestionRepository testQuestionRepository;

    @Autowired
    private TestAttemptRepository testAttemptRepository;

    public List<SkillTestDTO> getActiveTests(String currentEmail) {
        User user = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new RuntimeException("User not found: " + currentEmail));

        StudentProfile profile = studentProfileRepository.findByUserId(user.getId())
                .orElse(null);

        Long profileId = profile != null ? profile.getId() : null;

        List<SkillTest> tests = skillTestRepository.findByIsActiveTrue();
        return tests.stream().map(test -> {
            boolean hasPassed = false;
            Double bestScore = null;

            if (profileId != null) {
                Optional<TestAttempt> best = testAttemptRepository
                        .findFirstByStudentIdAndTestIdAndIsPassedTrueOrderByPercentageDesc(profileId, test.getId());
                if (best.isPresent()) {
                    hasPassed = true;
                    bestScore = best.get().getPercentage();
                }
            }

            return new SkillTestDTO(
                    test.getId(),
                    test.getTitle(),
                    test.getSkillName(),
                    test.getCategoryName(),
                    test.getDurationMinutes(),
                    test.getTotalQuestions(),
                    test.getPassPercentage(),
                    test.getDescription(),
                    test.isActive(),
                    hasPassed,
                    bestScore,
                    test.getCreatedAt()
            );
        }).collect(Collectors.toList());
    }

    public List<TestQuestionDTO> getTestQuestions(Long testId) {
        SkillTest test = skillTestRepository.findById(testId)
                .orElseThrow(() -> new RuntimeException("Skill test not found with ID: " + testId));

        if (!test.isActive()) {
            throw new RuntimeException("This skill test is currently inactive.");
        }

        List<TestQuestion> questions = testQuestionRepository.findByTestIdOrderByIdAsc(testId);
        return questions.stream().map(q -> new TestQuestionDTO(
                q.getId(),
                q.getQuestionText(),
                q.getOptionA(),
                q.getOptionB(),
                q.getOptionC(),
                q.getOptionD(),
                q.getMarks()
        )).collect(Collectors.toList());
    }

    @Transactional
    public TestResultDTO submitTest(String currentEmail, Long testId, SubmitTestRequest request) {
        User user = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new RuntimeException("User not found: " + currentEmail));

        StudentProfile profile = studentProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Student profile not found for email: " + currentEmail));

        SkillTest test = skillTestRepository.findById(testId)
                .orElseThrow(() -> new RuntimeException("Skill test not found with ID: " + testId));

        List<TestQuestion> questions = testQuestionRepository.findByTestIdOrderByIdAsc(testId);
        if (questions.isEmpty()) {
            throw new RuntimeException("This assessment has no questions configured yet.");
        }

        Map<Long, String> answers = request.getAnswers() != null ? request.getAnswers() : Collections.emptyMap();

        int score = 0;
        int totalMarks = 0;
        List<QuestionFeedbackDTO> feedbackList = new ArrayList<>();

        for (TestQuestion q : questions) {
            totalMarks += q.getMarks();
            String submitted = answers.get(q.getId());
            boolean isCorrect = false;

            if (submitted != null && submitted.trim().equalsIgnoreCase(q.getCorrectOption().trim())) {
                isCorrect = true;
                score += q.getMarks();
            }

            feedbackList.add(new QuestionFeedbackDTO(
                    q.getId(),
                    q.getQuestionText(),
                    submitted != null ? submitted.trim().toUpperCase() : "UNANSWERED",
                    q.getCorrectOption().trim().toUpperCase(),
                    isCorrect,
                    q.getExplanation()
            ));
        }

        double percentage = totalMarks > 0 ? ((double) score / totalMarks) * 100.0 : 0.0;
        percentage = Math.round(percentage * 10.0) / 10.0;
        boolean isPassed = percentage >= test.getPassPercentage();

        TestAttempt attempt = new TestAttempt(test, profile, score, totalMarks, percentage, isPassed);
        TestAttempt savedAttempt = testAttemptRepository.save(attempt);

        boolean badgeGranted = false;
        if (isPassed) {
            // Find student's skill for this test topic (TEACH skill preferred)
            List<StudentSkill> skills = studentSkillRepository.findByStudentProfileId(profile.getId());
            Optional<StudentSkill> matchingSkill = skills.stream()
                    .filter(s -> s.getSkillName().equalsIgnoreCase(test.getSkillName()))
                    .findFirst();

            if (matchingSkill.isPresent()) {
                StudentSkill sk = matchingSkill.get();
                sk.setVerified(true);
                sk.setVerifiedAt(LocalDateTime.now());
                sk.setVerificationScore(percentage);
                studentSkillRepository.save(sk);
                badgeGranted = true;
            } else {
                // Auto-award verified teaching skill
                StudentSkill newSkill = new StudentSkill(
                        profile,
                        test.getSkillName(),
                        test.getCategoryName(),
                        SkillType.TEACH,
                        ProficiencyLevel.ADVANCED
                );
                newSkill.setVerified(true);
                newSkill.setVerifiedAt(LocalDateTime.now());
                newSkill.setVerificationScore(percentage);
                studentSkillRepository.save(newSkill);
                badgeGranted = true;
            }
            logger.info("Student {} earned verified badge for skill '{}' with score {}%",
                    profile.getUser().getFullName(), test.getSkillName(), percentage);
        }

        TestResultDTO result = new TestResultDTO();
        result.setAttemptId(savedAttempt.getId());
        result.setTestId(test.getId());
        result.setTestTitle(test.getTitle());
        result.setSkillName(test.getSkillName());
        result.setScore(score);
        result.setTotalMarks(totalMarks);
        result.setPercentage(percentage);
        result.setPassPercentage(test.getPassPercentage());
        result.setPassed(isPassed);
        result.setVerifiedBadgeGranted(badgeGranted);
        result.setAttemptedAt(savedAttempt.getAttemptedAt());
        result.setQuestionFeedback(feedbackList);

        return result;
    }

    public List<TestAttemptResponseDTO> getStudentAttempts(String currentEmail) {
        User user = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new RuntimeException("User not found: " + currentEmail));

        StudentProfile profile = studentProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Student profile not found"));

        return testAttemptRepository.findByStudentIdOrderByAttemptedAtDesc(profile.getId())
                .stream()
                .map(this::mapAttemptToDTO)
                .collect(Collectors.toList());
    }

    public List<TestAttemptResponseDTO> getAllAttemptsForAdmin() {
        return testAttemptRepository.findAll()
                .stream()
                .sorted((a, b) -> b.getAttemptedAt().compareTo(a.getAttemptedAt()))
                .map(this::mapAttemptToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public StudentSkillDTO manualVerifySkill(Long studentSkillId, boolean verify) {
        StudentSkill skill = studentSkillRepository.findById(studentSkillId)
                .orElseThrow(() -> new RuntimeException("Student skill not found with ID: " + studentSkillId));

        skill.setVerified(verify);
        skill.setVerifiedAt(verify ? LocalDateTime.now() : null);
        skill.setVerificationScore(verify ? 100.0 : null);
        StudentSkill saved = studentSkillRepository.save(skill);

        return new StudentSkillDTO(
                saved.getId(),
                saved.getSkillName(),
                saved.getCategoryName(),
                saved.getSkillType(),
                saved.getProficiencyLevel(),
                saved.isVerified(),
                saved.getVerifiedAt(),
                saved.getVerificationScore()
        );
    }

    private TestAttemptResponseDTO mapAttemptToDTO(TestAttempt a) {
        return new TestAttemptResponseDTO(
                a.getId(),
                a.getTest().getId(),
                a.getTest().getTitle(),
                a.getTest().getSkillName(),
                a.getStudent().getId(),
                a.getStudent().getUser().getFullName(),
                a.getStudent().getUser().getEmail(),
                a.getScore(),
                a.getTotalMarks(),
                a.getPercentage(),
                a.isPassed(),
                a.getAttemptedAt()
        );
    }
}
