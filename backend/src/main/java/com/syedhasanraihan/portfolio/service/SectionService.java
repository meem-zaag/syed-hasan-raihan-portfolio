package com.syedhasanraihan.portfolio.service;

import com.syedhasanraihan.portfolio.common.NotFoundException;
import com.syedhasanraihan.portfolio.dto.common.ReorderItem;
import com.syedhasanraihan.portfolio.dto.section.AttachImageRequest;
import com.syedhasanraihan.portfolio.dto.section.SectionRequest;
import com.syedhasanraihan.portfolio.dto.section.SectionResponse;
import com.syedhasanraihan.portfolio.entity.Media;
import com.syedhasanraihan.portfolio.entity.Page;
import com.syedhasanraihan.portfolio.entity.Section;
import com.syedhasanraihan.portfolio.entity.SectionImage;
import com.syedhasanraihan.portfolio.repository.MediaRepository;
import com.syedhasanraihan.portfolio.repository.SectionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
public class SectionService {

    private final SectionRepository sectionRepository;
    private final MediaRepository mediaRepository;
    private final PageService pageService;

    public SectionService(SectionRepository sectionRepository, MediaRepository mediaRepository, PageService pageService) {
        this.sectionRepository = sectionRepository;
        this.mediaRepository = mediaRepository;
        this.pageService = pageService;
    }

    @Transactional(readOnly = true)
    public List<SectionResponse> listByPage(Long pageId) {
        pageService.findEntity(pageId);
        return sectionRepository.findByPageIdOrderByOrderIndexAsc(pageId).stream().map(SectionResponse::from).toList();
    }

    @Transactional
    public SectionResponse create(Long pageId, SectionRequest request) {
        Page page = pageService.findEntity(pageId);
        Section section = new Section();
        section.setPage(page);
        applyRequest(section, request);
        if (request.orderIndex() == null) {
            section.setOrderIndex((int) sectionRepository.countByPageId(pageId));
        }
        return SectionResponse.from(sectionRepository.save(section));
    }

    @Transactional
    public SectionResponse update(Long pageId, Long sectionId, SectionRequest request) {
        Section section = findInPage(pageId, sectionId);
        applyRequest(section, request);
        return SectionResponse.from(sectionRepository.save(section));
    }

    @Transactional
    public void delete(Long pageId, Long sectionId) {
        Section section = findInPage(pageId, sectionId);
        sectionRepository.delete(section);
    }

    @Transactional
    public void reorder(Long pageId, List<ReorderItem> items) {
        pageService.findEntity(pageId);
        Map<Long, Integer> orderByIdMap = items.stream()
                .collect(java.util.stream.Collectors.toMap(ReorderItem::id, ReorderItem::orderIndex));
        List<Section> sections = sectionRepository.findByPageIdOrderByOrderIndexAsc(pageId);
        for (Section section : sections) {
            Integer newOrder = orderByIdMap.get(section.getId());
            if (newOrder != null) {
                section.setOrderIndex(newOrder);
            }
        }
        sectionRepository.saveAll(sections);
    }

    @Transactional
    public SectionResponse attachImage(Long pageId, Long sectionId, AttachImageRequest request) {
        Section section = findInPage(pageId, sectionId);
        Media media = mediaRepository.findById(request.mediaId())
                .orElseThrow(() -> NotFoundException.of("Media", request.mediaId()));

        SectionImage image = new SectionImage();
        image.setSection(section);
        image.setMedia(media);
        image.setOrderIndex(request.orderIndex() != null ? request.orderIndex() : section.getImages().size());
        image.setCaption(request.caption());
        section.getImages().add(image);

        return SectionResponse.from(sectionRepository.save(section));
    }

    @Transactional
    public SectionResponse detachImage(Long pageId, Long sectionId, Long sectionImageId) {
        Section section = findInPage(pageId, sectionId);
        section.getImages().removeIf(img -> img.getId().equals(sectionImageId));
        return SectionResponse.from(sectionRepository.save(section));
    }

    private void applyRequest(Section section, SectionRequest request) {
        section.setSectionKey(request.sectionKey());
        section.setHeading(request.heading());
        section.setSubheading(request.subheading());
        section.setDescription(request.description());
        section.setSectionType(request.sectionType() != null ? request.sectionType() : "GENERIC");
        if (request.orderIndex() != null) {
            section.setOrderIndex(request.orderIndex());
        }
        if (request.visible() != null) {
            section.setVisible(request.visible());
        }
        section.setContentJson(request.contentJson());
    }

    private Section findInPage(Long pageId, Long sectionId) {
        Section section = sectionRepository.findById(sectionId)
                .orElseThrow(() -> NotFoundException.of("Section", sectionId));
        if (!section.getPage().getId().equals(pageId)) {
            throw new NotFoundException("Section " + sectionId + " does not belong to page " + pageId);
        }
        return section;
    }
}
