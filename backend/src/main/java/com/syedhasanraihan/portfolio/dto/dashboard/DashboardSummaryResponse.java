package com.syedhasanraihan.portfolio.dto.dashboard;

public record DashboardSummaryResponse(
        long unreadMessagesCount,
        long totalProjects,
        long totalSections,
        long totalMedia,
        LastEditedSection lastEditedSection
) {
    public record LastEditedSection(Long id, Long pageId, String pageSlug, String heading, java.time.Instant updatedAt) {
    }
}
