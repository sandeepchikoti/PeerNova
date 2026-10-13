package com.peernova.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "certificates")
public class Certificate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "certificate_number", nullable = false, unique = true, length = 60)
    private String certificateNumber;

    @Column(name = "verification_code", nullable = false, unique = true, length = 64)
    private String verificationCode;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "recipient_profile_id", nullable = false)
    private StudentProfile recipient;

    @Enumerated(EnumType.STRING)
    @Column(name = "certificate_type", nullable = false)
    private CertificateType certificateType;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(name = "subject_name", nullable = false, length = 150)
    private String subjectName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column
    private Double score;

    @Column(name = "recipient_name", nullable = false, length = 100)
    private String recipientName;

    @Column(name = "issuer_name", nullable = false, length = 100)
    private String issuerName = "PeerNova Academic Ecosystem";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "skill_test_id")
    private SkillTest skillTest;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "test_attempt_id")
    private TestAttempt testAttempt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "learning_session_id")
    private LearningSession learningSession;

    @Column(name = "issued_at", nullable = false, updatable = false)
    private LocalDateTime issuedAt;

    public Certificate() {
    }

    public Certificate(String certificateNumber, String verificationCode, StudentProfile recipient,
                       CertificateType certificateType, String title, String subjectName,
                       String description, Double score, String recipientName,
                       SkillTest skillTest, TestAttempt testAttempt, LearningSession learningSession) {
        this.certificateNumber = certificateNumber;
        this.verificationCode = verificationCode;
        this.recipient = recipient;
        this.certificateType = certificateType;
        this.title = title;
        this.subjectName = subjectName;
        this.description = description;
        this.score = score;
        this.recipientName = recipientName;
        this.skillTest = skillTest;
        this.testAttempt = testAttempt;
        this.learningSession = learningSession;
        this.issuedAt = LocalDateTime.now();
        this.issuerName = "PeerNova Academic Ecosystem";
    }

    @PrePersist
    protected void onCreate() {
        if (this.issuedAt == null) {
            this.issuedAt = LocalDateTime.now();
        }
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCertificateNumber() {
        return certificateNumber;
    }

    public void setCertificateNumber(String certificateNumber) {
        this.certificateNumber = certificateNumber;
    }

    public String getVerificationCode() {
        return verificationCode;
    }

    public void setVerificationCode(String verificationCode) {
        this.verificationCode = verificationCode;
    }

    public StudentProfile getRecipient() {
        return recipient;
    }

    public void setRecipient(StudentProfile recipient) {
        this.recipient = recipient;
    }

    public CertificateType getCertificateType() {
        return certificateType;
    }

    public void setCertificateType(CertificateType certificateType) {
        this.certificateType = certificateType;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSubjectName() {
        return subjectName;
    }

    public void setSubjectName(String subjectName) {
        this.subjectName = subjectName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getScore() {
        return score;
    }

    public void setScore(Double score) {
        this.score = score;
    }

    public String getRecipientName() {
        return recipientName;
    }

    public void setRecipientName(String recipientName) {
        this.recipientName = recipientName;
    }

    public String getIssuerName() {
        return issuerName;
    }

    public void setIssuerName(String issuerName) {
        this.issuerName = issuerName;
    }

    public SkillTest getSkillTest() {
        return skillTest;
    }

    public void setSkillTest(SkillTest skillTest) {
        this.skillTest = skillTest;
    }

    public TestAttempt getTestAttempt() {
        return testAttempt;
    }

    public void setTestAttempt(TestAttempt testAttempt) {
        this.testAttempt = testAttempt;
    }

    public LearningSession getLearningSession() {
        return learningSession;
    }

    public void setLearningSession(LearningSession learningSession) {
        this.learningSession = learningSession;
    }

    public LocalDateTime getIssuedAt() {
        return issuedAt;
    }

    public void setIssuedAt(LocalDateTime issuedAt) {
        this.issuedAt = issuedAt;
    }
}
