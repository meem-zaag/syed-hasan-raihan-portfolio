package com.syedhasanraihan.portfolio.dto.project;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.List;

public record ProjectRequest(
        @NotBlank @Size(max = 200) String title,
        String slug,
        @Size(max = 500) String summary,
        String description,
        String clientName,
        String category,
        String status,
        String repoUrl,
        String liveUrl,
        Boolean featured,
        Integer orderIndex,
        LocalDate startDate,
        LocalDate endDate,
        List<String> techStack
) {
}
