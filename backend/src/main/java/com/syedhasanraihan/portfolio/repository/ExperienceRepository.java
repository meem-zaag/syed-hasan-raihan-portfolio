package com.syedhasanraihan.portfolio.repository;

import com.syedhasanraihan.portfolio.entity.Experience;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExperienceRepository extends JpaRepository<Experience, Long> {
    List<Experience> findAllByOrderByOrderIndexAsc();
}
