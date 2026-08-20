package com.syedhasanraihan.portfolio.controller.publicapi;

import com.syedhasanraihan.portfolio.dto.page.PageDetailResponse;
import com.syedhasanraihan.portfolio.service.PageService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/pages")
@Tag(name = "Public - Pages")
public class PublicPageController {

    private final PageService pageService;

    public PublicPageController(PageService pageService) {
        this.pageService = pageService;
    }

    @GetMapping("/{slug}")
    public PageDetailResponse getBySlug(@PathVariable String slug) {
        return pageService.getPublicBySlug(slug);
    }
}
