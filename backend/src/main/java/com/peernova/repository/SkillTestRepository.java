package com.peernova.repository;

import com.peernova.entity.SkillTest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SkillTestRepository extends JpaRepository<SkillTest, Long> {

    List<SkillTest> findByIsActiveTrue();

    Optional<SkillTest> findBySkillNameIgnoreCaseAndIsActiveTrue(String skillName);

    boolean existsBySkillNameIgnoreCase(String skillName);
}
