package com.syedhasanraihan.portfolio.repository;

import com.syedhasanraihan.portfolio.entity.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    Optional<Project> findBySlug(String slug);
    boolean existsBySlug(String slug);
    long countBy();

    @Query("select p from Project p where " +
            "(:category is null or p.category = cast(:category as string)) and " +
            "(:featured is null or p.featured = :featured) " +
            "order by p.orderIndex asc")
    List<Project> findPublicProjects(@Param("category") String category, @Param("featured") Boolean featured);

    @Query("select p from Project p where " +
            "(:search is null or lower(p.title) like lower(concat('%', cast(:search as string), '%'))) and " +
            "(:category is null or p.category = cast(:category as string)) " +
            "order by p.orderIndex asc")
    Page<Project> searchAdminProjects(@Param("search") String search, @Param("category") String category, Pageable pageable);
}
