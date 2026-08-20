package com.syedhasanraihan.portfolio.service;

import com.syedhasanraihan.portfolio.dto.settings.SiteSettingsRequest;
import com.syedhasanraihan.portfolio.dto.settings.SiteSettingsResponse;
import com.syedhasanraihan.portfolio.entity.SiteSettings;
import com.syedhasanraihan.portfolio.repository.SiteSettingsRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SettingsService {

    private static final Long SINGLETON_ID = 1L;

    private final SiteSettingsRepository siteSettingsRepository;

    public SettingsService(SiteSettingsRepository siteSettingsRepository) {
        this.siteSettingsRepository = siteSettingsRepository;
    }

    @Transactional(readOnly = true)
    public SiteSettingsResponse get() {
        return SiteSettingsResponse.from(loadOrCreate());
    }

    @Transactional
    public SiteSettingsResponse update(SiteSettingsRequest request) {
        SiteSettings settings = loadOrCreate();
        settings.setSeoDefaultTitle(request.seoDefaultTitle());
        settings.setSeoDefaultDescription(request.seoDefaultDescription());
        settings.setThemeAccentColor(request.themeAccentColor());
        return SiteSettingsResponse.from(siteSettingsRepository.save(settings));
    }

    private SiteSettings loadOrCreate() {
        return siteSettingsRepository.findById(SINGLETON_ID).orElseGet(() -> {
            SiteSettings settings = new SiteSettings();
            settings.setId(SINGLETON_ID);
            return siteSettingsRepository.save(settings);
        });
    }
}
