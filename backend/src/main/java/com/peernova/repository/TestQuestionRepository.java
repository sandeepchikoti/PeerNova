package com.peernova.repository;

import com.peernova.entity.TestQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestQuestionRepository extends JpaRepository<TestQuestion, Long> {

    List<TestQuestion> findByTestIdOrderByIdAsc(Long testId);

    long countByTestId(Long testId);
}
