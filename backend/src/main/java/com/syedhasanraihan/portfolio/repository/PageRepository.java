package com.syedhasanraihan.portfolio.repository;

import com.syedhasanraihan.portfolio.entity.Page;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PageRepository extends JpaRepository<Page, Long> {
    Optional<Page> findBySlug(String slug);
}
