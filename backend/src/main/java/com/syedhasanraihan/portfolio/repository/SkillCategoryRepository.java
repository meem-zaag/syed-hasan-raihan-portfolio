package com.syedhasanraihan.portfolio.repository;

import com.syedhasanraihan.portfolio.entity.SkillCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SkillCategoryRepository extends JpaRepository<SkillCategory, Long> {
    List<SkillCategory> findAllByOrderByOrderIndexAsc();
}
