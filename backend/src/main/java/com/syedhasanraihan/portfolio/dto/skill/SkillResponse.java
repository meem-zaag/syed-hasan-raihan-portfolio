package com.syedhasanraihan.portfolio.dto.skill;

import com.syedhasanraihan.portfolio.entity.Skill;

public record SkillResponse(
        Long id,
        Long skillCategoryId,
        String name,
        int proficiency,
        String icon,
        int orderIndex
) {
    public static SkillResponse from(Skill skill) {
        return new SkillResponse(skill.getId(), skill.getSkillCategory().getId(), skill.getName(),
                skill.getProficiency(), skill.getIcon(), skill.getOrderIndex());
    }
}
