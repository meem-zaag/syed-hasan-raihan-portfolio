package com.syedhasanraihan.portfolio.service;

import com.syedhasanraihan.portfolio.common.NotFoundException;
import com.syedhasanraihan.portfolio.dto.education.EducationRequest;
import com.syedhasanraihan.portfolio.dto.education.EducationResponse;
import com.syedhasanraihan.portfolio.entity.Education;
import com.syedhasanraihan.portfolio.repository.EducationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EducationService {

    private final EducationRepository educationRepository;

    public EducationService(EducationRepository educationRepository) {
        this.educationRepository = educationRepository;
    }

    @Transactional(readOnly = true)
    public List<EducationResponse> list() {
        return educationRepository.findAllByOrderByOrderIndexAsc().stream().map(EducationResponse::from).toList();
    }

    @Transactional
    public EducationResponse create(EducationRequest request) {
        Education education = new Education();
        applyRequest(education, request);
        if (request.orderIndex() == null) {
            education.setOrderIndex((int) educationRepository.count());
        }
        return EducationResponse.from(educationRepository.save(education));
    }

    @Transactional
    public EducationResponse update(Long id, EducationRequest request) {
        Education education = findEntity(id);
        applyRequest(education, request);
        return EducationResponse.from(educationRepository.save(education));
    }

    @Transactional
    public void delete(Long id) {
        educationRepository.delete(findEntity(id));
    }

    private void applyRequest(Education education, EducationRequest request) {
        education.setInstitution(request.institution());
        education.setDegree(request.degree());
        education.setField(request.field());
        education.setStartDate(request.startDate());
        education.setEndDate(request.endDate());
        if (request.datePrecision() != null) {
            education.setDatePrecision(Education.DatePrecision.valueOf(request.datePrecision()));
        }
        education.setDescription(request.description());
        if (request.orderIndex() != null) {
            education.setOrderIndex(request.orderIndex());
        }
    }

    private Education findEntity(Long id) {
        return educationRepository.findById(id).orElseThrow(() -> NotFoundException.of("Education", id));
    }
}
