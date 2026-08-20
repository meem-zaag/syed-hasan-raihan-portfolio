package com.syedhasanraihan.portfolio.dto.settings;

public record SiteSettingsRequest(
        String seoDefaultTitle,
        String seoDefaultDescription,
        String themeAccentColor
) {
}
