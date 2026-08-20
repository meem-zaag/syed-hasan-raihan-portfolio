package com.syedhasanraihan.portfolio.dto.education;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;

public record EducationRequest(
        @NotBlank String institution,
        @NotBlank String degree,
        String field,
        LocalDate startDate,
        LocalDate endDate,
        String datePrecision,
        String description,
        Integer orderIndex
) {
}
