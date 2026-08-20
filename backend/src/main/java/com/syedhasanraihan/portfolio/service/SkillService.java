package com.syedhasanraihan.portfolio.service;

import com.syedhasanraihan.portfolio.common.NotFoundException;
import com.syedhasanraihan.portfolio.dto.skill.SkillCategoryRequest;
import com.syedhasanraihan.portfolio.dto.skill.SkillCategoryResponse;
import com.syedhasanraihan.portfolio.dto.skill.SkillRequest;
import com.syedhasanraihan.portfolio.dto.skill.SkillResponse;
import com.syedhasanraihan.portfolio.entity.Skill;
import com.syedhasanraihan.portfolio.entity.SkillCategory;
import com.syedhasanraihan.portfolio.repository.SkillCategoryRepository;
import com.syedhasanraihan.portfolio.repository.SkillRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SkillService {

    private final SkillCategoryRepository skillCategoryRepository;
    private final SkillRepository skillRepository;

    public SkillService(SkillCategoryRepository skillCategoryRepository, SkillRepository skillRepository) {
        this.skillCategoryRepository = skillCategoryRepository;
        this.skillRepository = skillRepository;
    }

    @Transactional(readOnly = true)
    public List<SkillCategoryResponse> listCategories() {
        return skillCategoryRepository.findAllByOrderByOrderIndexAsc().stream()
                .map(SkillCategoryResponse::from).toList();
    }

    @Transactional
    public SkillCategoryResponse createCategory(SkillCategoryRequest request) {
        SkillCategory category = new SkillCategory();
        category.setName(request.name());
        category.setOrderIndex(request.orderIndex() != null ? request.orderIndex() : (int) skillCategoryRepository.count());
        return SkillCategoryResponse.from(skillCategoryRepository.save(category));
    }

    @Transactional
    public SkillCategoryResponse updateCategory(Long id, SkillCategoryRequest request) {
        SkillCategory category = findCategory(id);
        category.setName(request.name());
        if (request.orderIndex() != null) {
            category.setOrderIndex(request.orderIndex());
        }
        return SkillCategoryResponse.from(skillCategoryRepository.save(category));
    }

    @Transactional
    public void deleteCategory(Long id) {
        skillCategoryRepository.delete(findCategory(id));
    }

    @Transactional(readOnly = true)
    public List<SkillResponse> listSkills() {
        return skillRepository.findAllByOrderByOrderIndexAsc().stream().map(SkillResponse::from).toList();
    }

    @Transactional
    public SkillResponse createSkill(SkillRequest request) {
        SkillCategory category = findCategory(request.skillCategoryId());
        Skill skill = new Skill();
        skill.setSkillCategory(category);
        applySkillRequest(skill, request);
        return SkillResponse.from(skillRepository.save(skill));
    }

    @Transactional
    public SkillResponse updateSkill(Long id, SkillRequest request) {
        Skill skill = findSkill(id);
        if (!skill.getSkillCategory().getId().equals(request.skillCategoryId())) {
            skill.setSkillCategory(findCategory(request.skillCategoryId()));
        }
        applySkillRequest(skill, request);
        return SkillResponse.from(skillRepository.save(skill));
    }

    @Transactional
    public void deleteSkill(Long id) {
        skillRepository.delete(findSkill(id));
    }

    private void applySkillRequest(Skill skill, SkillRequest request) {
        skill.setName(request.name());
        skill.setProficiency(request.proficiency());
        skill.setIcon(request.icon());
        if (request.orderIndex() != null) {
            skill.setOrderIndex(request.orderIndex());
        }
    }

    private SkillCategory findCategory(Long id) {
        return skillCategoryRepository.findById(id).orElseThrow(() -> NotFoundException.of("SkillCategory", id));
    }

    private Skill findSkill(Long id) {
        return skillRepository.findById(id).orElseThrow(() -> NotFoundException.of("Skill", id));
    }
}
