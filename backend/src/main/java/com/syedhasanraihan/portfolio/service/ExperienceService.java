package com.syedhasanraihan.portfolio.service;

import com.syedhasanraihan.portfolio.common.NotFoundException;
import com.syedhasanraihan.portfolio.dto.experience.ExperienceRequest;
import com.syedhasanraihan.portfolio.dto.experience.ExperienceResponse;
import com.syedhasanraihan.portfolio.entity.Experience;
import com.syedhasanraihan.portfolio.entity.Media;
import com.syedhasanraihan.portfolio.repository.ExperienceRepository;
import com.syedhasanraihan.portfolio.repository.MediaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ExperienceService {

    private final ExperienceRepository experienceRepository;
    private final MediaRepository mediaRepository;

    public ExperienceService(ExperienceRepository experienceRepository, MediaRepository mediaRepository) {
        this.experienceRepository = experienceRepository;
        this.mediaRepository = mediaRepository;
    }

    @Transactional(readOnly = true)
    public List<ExperienceResponse> list() {
        return experienceRepository.findAllByOrderByOrderIndexAsc().stream().map(ExperienceResponse::from).toList();
    }

    @Transactional
    public ExperienceResponse create(ExperienceRequest request) {
        Experience experience = new Experience();
        applyRequest(experience, request);
        if (request.orderIndex() == null) {
            experience.setOrderIndex((int) experienceRepository.count());
        }
        return ExperienceResponse.from(experienceRepository.save(experience));
    }

    @Transactional
    public ExperienceResponse update(Long id, ExperienceRequest request) {
        Experience experience = findEntity(id);
        applyRequest(experience, request);
        return ExperienceResponse.from(experienceRepository.save(experience));
    }

    @Transactional
    public void delete(Long id) {
        experienceRepository.delete(findEntity(id));
    }

    private void applyRequest(Experience experience, ExperienceRequest request) {
        experience.setCompany(request.company());
        experience.setRole(request.role());
        experience.setLocation(request.location());
        experience.setStartDate(request.startDate());
        experience.setEndDate(request.endDate());
        experience.setDescription(request.description());
        if (request.orderIndex() != null) {
            experience.setOrderIndex(request.orderIndex());
        }
        if (request.companyLogoMediaId() != null) {
            Media media = mediaRepository.findById(request.companyLogoMediaId())
                    .orElseThrow(() -> NotFoundException.of("Media", request.companyLogoMediaId()));
            experience.setCompanyLogoMedia(media);
        } else {
            experience.setCompanyLogoMedia(null);
        }
    }

    private Experience findEntity(Long id) {
        return experienceRepository.findById(id).orElseThrow(() -> NotFoundException.of("Experience", id));
    }
}
