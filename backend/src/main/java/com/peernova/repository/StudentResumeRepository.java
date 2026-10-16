package com.peernova.repository;

import com.peernova.entity.StudentResume;
import com.peernova.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentResumeRepository extends JpaRepository<StudentResume, Long> {
    Optional<StudentResume> findByUser(User user);
    Optional<StudentResume> findByUserId(Long userId);
    boolean existsByUserId(Long userId);
}
