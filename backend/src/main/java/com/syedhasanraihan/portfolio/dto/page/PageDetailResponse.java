package com.syedhasanraihan.portfolio.dto.page;

import com.syedhasanraihan.portfolio.dto.section.SectionResponse;
import com.syedhasanraihan.portfolio.entity.Page;

import java.time.Instant;
import java.util.List;

public record PageDetailResponse(
        Long id,
        String slug,
        String title,
        String metaTitle,
        String metaDescription,
        Instant updatedAt,
        List<SectionResponse> sections
) {
    public static PageDetailResponse from(Page page, List<SectionResponse> sections) {
        return new PageDetailResponse(page.getId(), page.getSlug(), page.getTitle(),
                page.getMetaTitle(), page.getMetaDescription(), page.getUpdatedAt(), sections);
    }
}
