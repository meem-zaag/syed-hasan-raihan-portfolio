package com.syedhasanraihan.portfolio.controller.publicapi;

import com.syedhasanraihan.portfolio.dto.project.ProjectResponse;
import com.syedhasanraihan.portfolio.service.ProjectService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public/projects")
@Tag(name = "Public - Projects")
public class PublicProjectController {

    private final ProjectService projectService;

    public PublicProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping
    public List<ProjectResponse> list(@RequestParam(required = false) String category,
                                       @RequestParam(required = false) Boolean featured) {
        return projectService.listPublic(category, featured);
    }

    @GetMapping("/{slug}")
    public ProjectResponse getBySlug(@PathVariable String slug) {
        return projectService.getPublicBySlug(slug);
    }
}
