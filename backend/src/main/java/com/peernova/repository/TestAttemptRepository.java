package com.peernova.repository;

import com.peernova.entity.TestAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TestAttemptRepository extends JpaRepository<TestAttempt, Long> {

    List<TestAttempt> findByStudentIdOrderByAttemptedAtDesc(Long studentProfileId);

    List<TestAttempt> findByTestIdOrderByAttemptedAtDesc(Long testId);

    Optional<TestAttempt> findFirstByStudentIdAndTestIdAndIsPassedTrueOrderByPercentageDesc(Long studentProfileId, Long testId);

    long countByStudentIdAndIsPassedTrue(Long studentProfileId);
}
