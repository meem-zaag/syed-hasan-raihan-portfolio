package com.syedhasanraihan.portfolio.controller.publicapi;

import com.syedhasanraihan.portfolio.dto.skill.SkillCategoryResponse;
import com.syedhasanraihan.portfolio.service.SkillService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/public/skills")
@Tag(name = "Public - Skills")
public class PublicSkillController {

    private final SkillService skillService;

    public PublicSkillController(SkillService skillService) {
        this.skillService = skillService;
    }

    @GetMapping
    public List<SkillCategoryResponse> list() {
        return skillService.listCategories();
    }
}
