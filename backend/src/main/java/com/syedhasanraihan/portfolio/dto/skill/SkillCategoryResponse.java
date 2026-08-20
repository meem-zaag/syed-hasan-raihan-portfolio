package com.syedhasanraihan.portfolio.dto.skill;

import com.syedhasanraihan.portfolio.entity.SkillCategory;

import java.util.List;

public record SkillCategoryResponse(
        Long id,
        String name,
        int orderIndex,
        List<SkillResponse> skills
) {
    public static SkillCategoryResponse from(SkillCategory category) {
        return new SkillCategoryResponse(category.getId(), category.getName(), category.getOrderIndex(),
                category.getSkills().stream().map(SkillResponse::from).toList());
    }
}
