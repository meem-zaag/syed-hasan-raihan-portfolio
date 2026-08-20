package com.syedhasanraihan.portfolio.dto.education;

import com.syedhasanraihan.portfolio.entity.Education;

import java.time.LocalDate;

public record EducationResponse(
        Long id,
        String institution,
        String degree,
        String field,
        LocalDate startDate,
        LocalDate endDate,
        String datePrecision,
        String description,
        int orderIndex
) {
    public static EducationResponse from(Education education) {
        return new EducationResponse(
                education.getId(),
                education.getInstitution(),
                education.getDegree(),
                education.getField(),
                education.getStartDate(),
                education.getEndDate(),
                education.getDatePrecision().name(),
                education.getDescription(),
                education.getOrderIndex()
        );
    }
}
