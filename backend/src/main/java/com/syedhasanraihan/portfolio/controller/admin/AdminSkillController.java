package com.syedhasanraihan.portfolio.controller.admin;

import com.syedhasanraihan.portfolio.dto.skill.SkillCategoryRequest;
import com.syedhasanraihan.portfolio.dto.skill.SkillCategoryResponse;
import com.syedhasanraihan.portfolio.dto.skill.SkillRequest;
import com.syedhasanraihan.portfolio.dto.skill.SkillResponse;
import com.syedhasanraihan.portfolio.service.SkillService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Tag(name = "Admin - Skills")
@SecurityRequirement(name = "bearerAuth")
public class AdminSkillController {

    private final SkillService skillService;

    public AdminSkillController(SkillService skillService) {
        this.skillService = skillService;
    }

    @GetMapping("/api/admin/skill-categories")
    public List<SkillCategoryResponse> listCategories() {
        return skillService.listCategories();
    }

    @PostMapping("/api/admin/skill-categories")
    @ResponseStatus(HttpStatus.CREATED)
    public SkillCategoryResponse createCategory(@Valid @RequestBody SkillCategoryRequest request) {
        return skillService.createCategory(request);
    }

    @PutMapping("/api/admin/skill-categories/{id}")
    public SkillCategoryResponse updateCategory(@PathVariable Long id, @Valid @RequestBody SkillCategoryRequest request) {
        return skillService.updateCategory(id, request);
    }

    @DeleteMapping("/api/admin/skill-categories/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCategory(@PathVariable Long id) {
        skillService.deleteCategory(id);
    }

    @GetMapping("/api/admin/skills")
    public List<SkillResponse> listSkills() {
        return skillService.listSkills();
    }

    @PostMapping("/api/admin/skills")
    @ResponseStatus(HttpStatus.CREATED)
    public SkillResponse createSkill(@Valid @RequestBody SkillRequest request) {
        return skillService.createSkill(request);
    }

    @PutMapping("/api/admin/skills/{id}")
    public SkillResponse updateSkill(@PathVariable Long id, @Valid @RequestBody SkillRequest request) {
        return skillService.updateSkill(id, request);
    }

    @DeleteMapping("/api/admin/skills/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteSkill(@PathVariable Long id) {
        skillService.deleteSkill(id);
    }
}
