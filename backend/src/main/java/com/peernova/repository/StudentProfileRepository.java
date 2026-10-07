package com.peernova.repository;

import com.peernova.entity.StudentProfile;
import com.peernova.entity.VerificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentProfileRepository extends JpaRepository<StudentProfile, Long> {
    Optional<StudentProfile> findByUserId(Long userId);
    Optional<StudentProfile> findByUserEmail(String email);
    List<StudentProfile> findByVerificationStatus(VerificationStatus status);
    long countByVerificationStatus(VerificationStatus status);

    @Query("SELECT p FROM StudentProfile p WHERE LOWER(p.user.fullName) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.college) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.department) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<StudentProfile> searchProfiles(String query);
}
