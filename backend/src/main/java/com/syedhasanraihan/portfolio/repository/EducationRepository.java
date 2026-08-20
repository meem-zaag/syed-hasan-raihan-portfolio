package com.syedhasanraihan.portfolio.repository;

import com.syedhasanraihan.portfolio.entity.Education;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EducationRepository extends JpaRepository<Education, Long> {
    List<Education> findAllByOrderByOrderIndexAsc();
}
