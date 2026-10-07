package com.peernova.repository;

import com.peernova.entity.SkillType;
import com.peernova.entity.StudentSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentSkillRepository extends JpaRepository<StudentSkill, Long> {
    List<StudentSkill> findByStudentProfileId(Long studentProfileId);
    List<StudentSkill> findByStudentProfileIdAndSkillType(Long studentProfileId, SkillType skillType);
    boolean existsByStudentProfileIdAndSkillNameAndSkillType(Long studentProfileId, String skillName, SkillType skillType);
    void deleteByStudentProfileIdAndId(Long studentProfileId, Long id);
}
