package com.syedhasanraihan.portfolio.service;

import com.syedhasanraihan.portfolio.common.NotFoundException;
import com.syedhasanraihan.portfolio.dto.page.PageDetailResponse;
import com.syedhasanraihan.portfolio.dto.page.PageResponse;
import com.syedhasanraihan.portfolio.dto.page.PageUpdateRequest;
import com.syedhasanraihan.portfolio.dto.section.SectionResponse;
import com.syedhasanraihan.portfolio.entity.Page;
import com.syedhasanraihan.portfolio.repository.PageRepository;
import com.syedhasanraihan.portfolio.repository.SectionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PageService {

    private final PageRepository pageRepository;
    private final SectionRepository sectionRepository;

    public PageService(PageRepository pageRepository, SectionRepository sectionRepository) {
        this.pageRepository = pageRepository;
        this.sectionRepository = sectionRepository;
    }

    @Transactional(readOnly = true)
    public List<PageResponse> listAll() {
        return pageRepository.findAll().stream().map(PageResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public PageResponse getById(Long id) {
        return PageResponse.from(findEntity(id));
    }

    @Transactional(readOnly = true)
    public PageDetailResponse getPublicBySlug(String slug) {
        Page page = pageRepository.findBySlug(slug).orElseThrow(() -> new NotFoundException("Page not found: " + slug));
        List<SectionResponse> sections = sectionRepository.findByPageIdAndVisibleTrueOrderByOrderIndexAsc(page.getId())
                .stream().map(SectionResponse::from).toList();
        return PageDetailResponse.from(page, sections);
    }

    @Transactional
    public PageResponse update(Long id, PageUpdateRequest request) {
        Page page = findEntity(id);
        page.setTitle(request.title());
        page.setMetaTitle(request.metaTitle());
        page.setMetaDescription(request.metaDescription());
        return PageResponse.from(pageRepository.save(page));
    }

    Page findEntity(Long id) {
        return pageRepository.findById(id).orElseThrow(() -> NotFoundException.of("Page", id));
    }
}
