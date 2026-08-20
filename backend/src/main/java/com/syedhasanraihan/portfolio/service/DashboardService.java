package com.syedhasanraihan.portfolio.service;

import com.syedhasanraihan.portfolio.dto.dashboard.DashboardSummaryResponse;
import com.syedhasanraihan.portfolio.entity.Section;
import com.syedhasanraihan.portfolio.repository.ContactMessageRepository;
import com.syedhasanraihan.portfolio.repository.MediaRepository;
import com.syedhasanraihan.portfolio.repository.ProjectRepository;
import com.syedhasanraihan.portfolio.repository.SectionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DashboardService {

    private final ContactMessageRepository contactMessageRepository;
    private final ProjectRepository projectRepository;
    private final SectionRepository sectionRepository;
    private final MediaRepository mediaRepository;

    public DashboardService(ContactMessageRepository contactMessageRepository, ProjectRepository projectRepository,
                             SectionRepository sectionRepository, MediaRepository mediaRepository) {
        this.contactMessageRepository = contactMessageRepository;
        this.projectRepository = projectRepository;
        this.sectionRepository = sectionRepository;
        this.mediaRepository = mediaRepository;
    }

    @Transactional(readOnly = true)
    public DashboardSummaryResponse summary() {
        DashboardSummaryResponse.LastEditedSection lastEdited = sectionRepository.findTopByOrderByUpdatedAtDesc()
                .map(this::toLastEdited)
                .orElse(null);

        return new DashboardSummaryResponse(
                contactMessageRepository.countByReadFalse(),
                projectRepository.countBy(),
                sectionRepository.count(),
                mediaRepository.countBy(),
                lastEdited
        );
    }

    private DashboardSummaryResponse.LastEditedSection toLastEdited(Section section) {
        return new DashboardSummaryResponse.LastEditedSection(
                section.getId(),
                section.getPage().getId(),
                section.getPage().getSlug(),
                section.getHeading(),
                section.getUpdatedAt()
        );
    }
}
