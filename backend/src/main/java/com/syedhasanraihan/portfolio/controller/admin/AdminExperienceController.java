package com.syedhasanraihan.portfolio.controller.admin;

import com.syedhasanraihan.portfolio.dto.experience.ExperienceRequest;
import com.syedhasanraihan.portfolio.dto.experience.ExperienceResponse;
import com.syedhasanraihan.portfolio.service.ExperienceService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/experience")
@Tag(name = "Admin - Experience")
@SecurityRequirement(name = "bearerAuth")
public class AdminExperienceController {

    private final ExperienceService experienceService;

    public AdminExperienceController(ExperienceService experienceService) {
        this.experienceService = experienceService;
    }

    @GetMapping
    public List<ExperienceResponse> list() {
        return experienceService.list();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ExperienceResponse create(@Valid @RequestBody ExperienceRequest request) {
        return experienceService.create(request);
    }

    @PutMapping("/{id}")
    public ExperienceResponse update(@PathVariable Long id, @Valid @RequestBody ExperienceRequest request) {
        return experienceService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        experienceService.delete(id);
    }
}
