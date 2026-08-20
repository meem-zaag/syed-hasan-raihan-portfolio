package com.syedhasanraihan.portfolio.dto.experience;

import com.syedhasanraihan.portfolio.dto.media.MediaResponse;
import com.syedhasanraihan.portfolio.entity.Experience;

import java.time.LocalDate;

public record ExperienceResponse(
        Long id,
        String company,
        String role,
        String location,
        LocalDate startDate,
        LocalDate endDate,
        String description,
        MediaResponse companyLogo,
        int orderIndex
) {
    public static ExperienceResponse from(Experience experience) {
        return new ExperienceResponse(
                experience.getId(),
                experience.getCompany(),
                experience.getRole(),
                experience.getLocation(),
                experience.getStartDate(),
                experience.getEndDate(),
                experience.getDescription(),
                MediaResponse.from(experience.getCompanyLogoMedia()),
                experience.getOrderIndex()
        );
    }
}
