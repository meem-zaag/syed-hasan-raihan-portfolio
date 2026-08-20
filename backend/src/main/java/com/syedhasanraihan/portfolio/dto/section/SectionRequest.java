package com.syedhasanraihan.portfolio.dto.section;

import jakarta.validation.constraints.NotBlank;

public record SectionRequest(
        @NotBlank String sectionKey,
        String heading,
        String subheading,
        String description,
        String sectionType,
        Integer orderIndex,
        Boolean visible,
        String contentJson
) {
}
