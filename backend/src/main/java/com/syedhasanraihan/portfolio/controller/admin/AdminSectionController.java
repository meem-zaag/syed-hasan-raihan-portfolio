package com.syedhasanraihan.portfolio.controller.admin;

import com.syedhasanraihan.portfolio.dto.common.ReorderRequest;
import com.syedhasanraihan.portfolio.dto.section.AttachImageRequest;
import com.syedhasanraihan.portfolio.dto.section.SectionRequest;
import com.syedhasanraihan.portfolio.dto.section.SectionResponse;
import com.syedhasanraihan.portfolio.service.SectionService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/pages/{pageId}/sections")
@Tag(name = "Admin - Sections")
@SecurityRequirement(name = "bearerAuth")
public class AdminSectionController {

    private final SectionService sectionService;

    public AdminSectionController(SectionService sectionService) {
        this.sectionService = sectionService;
    }

    @GetMapping
    public List<SectionResponse> list(@PathVariable Long pageId) {
        return sectionService.listByPage(pageId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SectionResponse create(@PathVariable Long pageId, @Valid @RequestBody SectionRequest request) {
        return sectionService.create(pageId, request);
    }

    @PutMapping("/{sectionId}")
    public SectionResponse update(@PathVariable Long pageId, @PathVariable Long sectionId,
                                   @Valid @RequestBody SectionRequest request) {
        return sectionService.update(pageId, sectionId, request);
    }

    @DeleteMapping("/{sectionId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long pageId, @PathVariable Long sectionId) {
        sectionService.delete(pageId, sectionId);
    }

    @PatchMapping("/reorder")
    public List<SectionResponse> reorder(@PathVariable Long pageId, @Valid @RequestBody ReorderRequest request) {
        sectionService.reorder(pageId, request.items());
        return sectionService.listByPage(pageId);
    }

    @PostMapping("/{sectionId}/images")
    public SectionResponse attachImage(@PathVariable Long pageId, @PathVariable Long sectionId,
                                        @Valid @RequestBody AttachImageRequest request) {
        return sectionService.attachImage(pageId, sectionId, request);
    }

    @DeleteMapping("/{sectionId}/images/{sectionImageId}")
    public SectionResponse detachImage(@PathVariable Long pageId, @PathVariable Long sectionId,
                                        @PathVariable Long sectionImageId) {
        return sectionService.detachImage(pageId, sectionId, sectionImageId);
    }
}
