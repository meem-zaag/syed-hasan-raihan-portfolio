package com.syedhasanraihan.portfolio.repository;

import com.syedhasanraihan.portfolio.entity.SectionImage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SectionImageRepository extends JpaRepository<SectionImage, Long> {
    boolean existsByMediaId(Long mediaId);
    void deleteByMediaId(Long mediaId);
}
