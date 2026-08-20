package com.syedhasanraihan.portfolio.repository;

import com.syedhasanraihan.portfolio.entity.Media;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MediaRepository extends JpaRepository<Media, Long> {
    long countBy();

    @Query("select m from Media m where " +
            "(:search is null or lower(m.originalFileName) like lower(concat('%', cast(:search as string), '%'))) and " +
            "(:contentType is null or m.contentType = cast(:contentType as string)) " +
            "order by m.uploadedAt desc")
    Page<Media> search(@Param("search") String search, @Param("contentType") String contentType, Pageable pageable);
}
