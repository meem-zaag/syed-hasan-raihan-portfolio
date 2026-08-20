package com.syedhasanraihan.portfolio.dto.page;

import com.syedhasanraihan.portfolio.entity.Page;

import java.time.Instant;

public record PageResponse(
        Long id,
        String slug,
        String title,
        String metaTitle,
        String metaDescription,
        Instant updatedAt
) {
    public static PageResponse from(Page page) {
        return new PageResponse(page.getId(), page.getSlug(), page.getTitle(),
                page.getMetaTitle(), page.getMetaDescription(), page.getUpdatedAt());
    }
}
