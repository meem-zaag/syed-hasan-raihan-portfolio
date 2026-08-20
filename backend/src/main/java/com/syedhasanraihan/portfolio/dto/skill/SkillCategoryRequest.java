package com.syedhasanraihan.portfolio.dto.skill;

import jakarta.validation.constraints.NotBlank;

public record SkillCategoryRequest(
        @NotBlank String name,
        Integer orderIndex
) {
}
