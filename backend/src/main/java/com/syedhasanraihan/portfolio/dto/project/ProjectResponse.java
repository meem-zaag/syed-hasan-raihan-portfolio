package com.syedhasanraihan.portfolio.dto.project;

import com.syedhasanraihan.portfolio.entity.Project;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

public record ProjectResponse(
        Long id,
        String title,
        String slug,
        String summary,
        String description,
        String clientName,
        String category,
        String status,
        String repoUrl,
        String liveUrl,
        boolean featured,
        int orderIndex,
        LocalDate startDate,
        LocalDate endDate,
        List<String> techStack,
        List<ProjectImageResponse> images,
        Instant createdAt,
        Instant updatedAt
) {
    public static ProjectResponse from(Project project) {
        return new ProjectResponse(
                project.getId(),
                project.getTitle(),
                project.getSlug(),
                project.getSummary(),
                project.getDescription(),
                project.getClientName(),
                project.getCategory(),
                project.getStatus().name(),
                project.getRepoUrl(),
                project.getLiveUrl(),
                project.isFeatured(),
                project.getOrderIndex(),
                project.getStartDate(),
                project.getEndDate(),
                List.copyOf(project.getTechStack()),
                project.getImages().stream().map(ProjectImageResponse::from).toList(),
                project.getCreatedAt(),
                project.getUpdatedAt()
        );
    }
}
