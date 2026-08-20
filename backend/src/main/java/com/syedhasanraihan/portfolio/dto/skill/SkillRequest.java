package com.syedhasanraihan.portfolio.dto.skill;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record SkillRequest(
        @NotNull Long skillCategoryId,
        @NotBlank String name,
        @Min(0) @Max(100) int proficiency,
        String icon,
        Integer orderIndex
) {
}
