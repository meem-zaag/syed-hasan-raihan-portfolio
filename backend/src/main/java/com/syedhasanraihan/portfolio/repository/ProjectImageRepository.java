package com.syedhasanraihan.portfolio.repository;

import com.syedhasanraihan.portfolio.entity.ProjectImage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectImageRepository extends JpaRepository<ProjectImage, Long> {
    boolean existsByMediaId(Long mediaId);
    void deleteByMediaId(Long mediaId);
}
