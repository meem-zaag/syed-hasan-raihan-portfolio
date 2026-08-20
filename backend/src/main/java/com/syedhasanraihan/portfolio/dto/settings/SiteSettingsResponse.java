package com.syedhasanraihan.portfolio.dto.settings;

import com.syedhasanraihan.portfolio.entity.SiteSettings;

import java.time.Instant;

public record SiteSettingsResponse(
        Long id,
        String seoDefaultTitle,
        String seoDefaultDescription,
        String themeAccentColor,
        Instant updatedAt
) {
    public static SiteSettingsResponse from(SiteSettings settings) {
        return new SiteSettingsResponse(settings.getId(), settings.getSeoDefaultTitle(),
                settings.getSeoDefaultDescription(), settings.getThemeAccentColor(), settings.getUpdatedAt());
    }
}
