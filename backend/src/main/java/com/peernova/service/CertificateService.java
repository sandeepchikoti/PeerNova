package com.peernova.service;

import com.peernova.dto.CertificateDTO;
import com.peernova.entity.*;
import com.peernova.exception.BadRequestException;
import com.peernova.exception.ResourceNotFoundException;
import com.peernova.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.Year;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CertificateService {

    @Autowired
    private CertificateRepository certificateRepository;

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TestAttemptRepository testAttemptRepository;

    @Autowired
    private LearningSessionRepository learningSessionRepository;

    private final Random random = new Random();

    // Student: List my earned certificates
    @Transactional(readOnly = true)
    public List<CertificateDTO> getMyCertificates(String email) {
        StudentProfile student = getStudentProfileByEmail(email);
        return certificateRepository.findByRecipientIdOrderByIssuedAtDesc(student.getId()).stream()
                .map(CertificateDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // Public / Student: Get certificate by ID
    @Transactional(readOnly = true)
    public CertificateDTO getCertificateById(Long id) {
        Certificate cert = certificateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate not found with ID: " + id));
        return CertificateDTO.fromEntity(cert);
    }

    // Public: Verify certificate authenticity by unique verification code
    @Transactional(readOnly = true)
    public CertificateDTO verifyCertificate(String verificationCode) {
        Certificate cert = certificateRepository.findByVerificationCode(verificationCode)
                .orElseThrow(() -> new ResourceNotFoundException("No authentic certificate matches verification code: " + verificationCode));
        return CertificateDTO.fromEntity(cert);
    }

    // Student / System: Generate Certificate for Passed Skill Assessment
    @Transactional
    public CertificateDTO generateCertificateForSkillTest(String email, Long attemptId) {
        StudentProfile student = getStudentProfileByEmail(email);
        TestAttempt attempt = testAttemptRepository.findById(attemptId)
                .orElseThrow(() -> new ResourceNotFoundException("Test attempt not found with ID: " + attemptId));

        if (!attempt.getStudent().getId().equals(student.getId())) {
            throw new BadRequestException("You can only generate certificates for your own test attempts");
        }

        if (!attempt.isPassed()) {
            throw new BadRequestException("Certificate can only be issued for passed assessments (Score >= 70%)");
        }

        // Check if certificate already exists for this attempt (idempotent)
        Optional<Certificate> existing = certificateRepository.findByTestAttemptId(attemptId);
        if (existing.isPresent()) {
            return CertificateDTO.fromEntity(existing.get());
        }

        String recipientName = student.getUser() != null ? student.getUser().getFullName() : "PeerNova Scholar";
        String skillName = attempt.getTest().getSkillName() != null ? attempt.getTest().getSkillName() : attempt.getTest().getTitle();
        String certNumber = generateUniqueCertNumber("SKILL");
        String verificationCode = UUID.randomUUID().toString().replace("-", "").toUpperCase();

        String description = String.format(
                "This certifies that %s has demonstrated verified competency in %s by successfully passing the standardized peer examination with a score of %.1f%%.",
                recipientName, skillName, attempt.getPercentage()
        );

        Certificate certificate = new Certificate(
                certNumber,
                verificationCode,
                student,
                CertificateType.SKILL_COMPETENCY,
                "Certificate of Technical Competency",
                skillName,
                description,
                attempt.getPercentage(),
                recipientName,
                attempt.getTest(),
                attempt,
                null
        );

        Certificate saved = certificateRepository.save(certificate);
        return CertificateDTO.fromEntity(saved);
    }

    // Student / System: Generate Certificate for Completed Learning Session
    @Transactional
    public CertificateDTO generateCertificateForSession(String email, Long sessionId) {
        StudentProfile student = getStudentProfileByEmail(email);
        LearningSession session = learningSessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Learning session not found with ID: " + sessionId));

        boolean isParticipant = session.getLearner().getId().equals(student.getId()) ||
                                session.getMentor().getId().equals(student.getId());

        if (!isParticipant) {
            throw new BadRequestException("You were not a registered participant in this learning session");
        }

        if (session.getStatus() != SessionStatus.COMPLETED) {
            throw new BadRequestException("Certificate can only be generated for sessions marked as COMPLETED");
        }

        // Check if certificate already exists for this session and student
        Optional<Certificate> existing = certificateRepository.findByLearningSessionIdAndRecipientId(sessionId, student.getId());
        if (existing.isPresent()) {
            return CertificateDTO.fromEntity(existing.get());
        }

        boolean isMentor = session.getMentor().getId().equals(student.getId());
        String roleText = isMentor ? "Mentorship & Instruction" : "Collaborative Learning";
        String recipientName = student.getUser() != null ? student.getUser().getFullName() : "PeerNova Scholar";
        String certNumber = generateUniqueCertNumber("SESS");
        String verificationCode = UUID.randomUUID().toString().replace("-", "").toUpperCase();

        String description = String.format(
                "This certifies that %s has successfully completed a structured peer collaboration session on topic '%s' (%d minutes) with verified attendance in %s.",
                recipientName, session.getSkillTopic(), session.getDurationMinutes(), roleText
        );

        Certificate certificate = new Certificate(
                certNumber,
                verificationCode,
                student,
                CertificateType.SESSION_COMPLETION,
                "Certificate of Collaborative Learning Completion",
                session.getSkillTopic(),
                description,
                null,
                recipientName,
                null,
                null,
                session
        );

        Certificate saved = certificateRepository.save(certificate);
        return CertificateDTO.fromEntity(saved);
    }

    // Admin: List all certificates issued across platform
    @Transactional(readOnly = true)
    public List<CertificateDTO> getAllCertificatesForAdmin() {
        return certificateRepository.findAllByOrderByIssuedAtDesc().stream()
                .map(CertificateDTO::fromEntity)
                .collect(Collectors.toList());
    }

    private StudentProfile getStudentProfileByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return studentProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for user: " + email));
    }

    private String generateUniqueCertNumber(String prefix) {
        int year = Year.now().getValue();
        String certNumber;
        do {
            int randomPart = 100000 + random.nextInt(900000);
            certNumber = String.format("PN-%d-%s-%d", year, prefix, randomPart);
        } while (certificateRepository.existsByCertificateNumber(certNumber));
        return certNumber;
    }
}
