package com.syedhasanraihan.portfolio.repository;

import com.syedhasanraihan.portfolio.entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SkillRepository extends JpaRepository<Skill, Long> {
    List<Skill> findAllByOrderByOrderIndexAsc();
    List<Skill> findBySkillCategoryIdOrderByOrderIndexAsc(Long skillCategoryId);
}
