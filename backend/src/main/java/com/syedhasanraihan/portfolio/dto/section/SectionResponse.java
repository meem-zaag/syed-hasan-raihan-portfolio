package com.syedhasanraihan.portfolio.dto.section;

import com.syedhasanraihan.portfolio.entity.Section;

import java.time.Instant;
import java.util.List;

public record SectionResponse(
        Long id,
        Long pageId,
        String sectionKey,
        String heading,
        String subheading,
        String description,
        String sectionType,
        int orderIndex,
        boolean visible,
        String contentJson,
        List<SectionImageResponse> images,
        Instant createdAt,
        Instant updatedAt
) {
    public static SectionResponse from(Section section) {
        return new SectionResponse(
                section.getId(),
                section.getPage().getId(),
                section.getSectionKey(),
                section.getHeading(),
                section.getSubheading(),
                section.getDescription(),
                section.getSectionType(),
                section.getOrderIndex(),
                section.isVisible(),
                section.getContentJson(),
                section.getImages().stream().map(SectionImageResponse::from).toList(),
                section.getCreatedAt(),
                section.getUpdatedAt()
        );
    }
}
