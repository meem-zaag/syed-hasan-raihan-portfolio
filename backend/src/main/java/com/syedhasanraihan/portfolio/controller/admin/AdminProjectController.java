package com.syedhasanraihan.portfolio.controller.admin;

import com.syedhasanraihan.portfolio.dto.common.PageResult;
import com.syedhasanraihan.portfolio.dto.common.ReorderRequest;
import com.syedhasanraihan.portfolio.dto.project.AttachProjectImageRequest;
import com.syedhasanraihan.portfolio.dto.project.ProjectRequest;
import com.syedhasanraihan.portfolio.dto.project.ProjectResponse;
import com.syedhasanraihan.portfolio.service.ProjectService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/projects")
@Tag(name = "Admin - Projects")
@SecurityRequirement(name = "bearerAuth")
public class AdminProjectController {

    private final ProjectService projectService;

    public AdminProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping
    public PageResult<ProjectResponse> list(@RequestParam(required = false) String search,
                                             @RequestParam(required = false) String category,
                                             Pageable pageable) {
        return projectService.listAdmin(search, category, pageable);
    }

    @GetMapping("/{id}")
    public ProjectResponse getById(@PathVariable Long id) {
        return projectService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProjectResponse create(@Valid @RequestBody ProjectRequest request) {
        return projectService.create(request);
    }

    @PutMapping("/{id}")
    public ProjectResponse update(@PathVariable Long id, @Valid @RequestBody ProjectRequest request) {
        return projectService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        projectService.delete(id);
    }

    @PatchMapping("/reorder")
    public void reorder(@Valid @RequestBody ReorderRequest request) {
        projectService.reorder(request.items());
    }

    @PostMapping("/{id}/images")
    public ProjectResponse attachImage(@PathVariable Long id, @Valid @RequestBody AttachProjectImageRequest request) {
        return projectService.attachImage(id, request);
    }

    @DeleteMapping("/{id}/images/{projectImageId}")
    public ProjectResponse detachImage(@PathVariable Long id, @PathVariable Long projectImageId) {
        return projectService.detachImage(id, projectImageId);
    }
}
