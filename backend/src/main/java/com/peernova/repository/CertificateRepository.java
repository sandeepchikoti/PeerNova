package com.peernova.repository;

import com.peernova.entity.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, Long> {

    List<Certificate> findByRecipientIdOrderByIssuedAtDesc(Long recipientId);

    Optional<Certificate> findByCertificateNumber(String certificateNumber);

    Optional<Certificate> findByVerificationCode(String verificationCode);

    boolean existsByCertificateNumber(String certificateNumber);

    Optional<Certificate> findByTestAttemptId(Long testAttemptId);

    Optional<Certificate> findByLearningSessionIdAndRecipientId(Long learningSessionId, Long recipientId);

    List<Certificate> findAllByOrderByIssuedAtDesc();
}
