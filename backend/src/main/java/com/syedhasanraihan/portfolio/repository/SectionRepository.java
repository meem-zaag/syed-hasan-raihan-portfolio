package com.syedhasanraihan.portfolio.repository;

import com.syedhasanraihan.portfolio.entity.Section;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SectionRepository extends JpaRepository<Section, Long> {
    List<Section> findByPageIdOrderByOrderIndexAsc(Long pageId);
    List<Section> findByPageIdAndVisibleTrueOrderByOrderIndexAsc(Long pageId);
    long countByPageId(Long pageId);
    Optional<Section> findTopByOrderByUpdatedAtDesc();
}
