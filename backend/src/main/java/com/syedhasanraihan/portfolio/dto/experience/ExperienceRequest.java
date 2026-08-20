package com.syedhasanraihan.portfolio.dto.experience;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record ExperienceRequest(
        @NotBlank String company,
        @NotBlank String role,
        String location,
        @NotNull LocalDate startDate,
        LocalDate endDate,
        String description,
        Long companyLogoMediaId,
        Integer orderIndex
) {
}
