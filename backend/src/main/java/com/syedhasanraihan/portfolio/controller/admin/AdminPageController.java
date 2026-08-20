package com.syedhasanraihan.portfolio.controller.admin;

import com.syedhasanraihan.portfolio.dto.page.PageResponse;
import com.syedhasanraihan.portfolio.dto.page.PageUpdateRequest;
import com.syedhasanraihan.portfolio.service.PageService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/pages")
@Tag(name = "Admin - Pages")
@SecurityRequirement(name = "bearerAuth")
public class AdminPageController {

    private final PageService pageService;

    public AdminPageController(PageService pageService) {
        this.pageService = pageService;
    }

    @GetMapping
    public List<PageResponse> listAll() {
        return pageService.listAll();
    }

    @GetMapping("/{pageId}")
    public PageResponse getById(@PathVariable Long pageId) {
        return pageService.getById(pageId);
    }

    @PutMapping("/{pageId}")
    public PageResponse update(@PathVariable Long pageId, @Valid @RequestBody PageUpdateRequest request) {
        return pageService.update(pageId, request);
    }
}
