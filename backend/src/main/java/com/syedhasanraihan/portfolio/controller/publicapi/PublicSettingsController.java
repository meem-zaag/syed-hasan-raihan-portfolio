package com.syedhasanraihan.portfolio.controller.publicapi;

import com.syedhasanraihan.portfolio.dto.settings.SiteSettingsResponse;
import com.syedhasanraihan.portfolio.service.SettingsService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/settings")
@Tag(name = "Public - Settings")
public class PublicSettingsController {

    private final SettingsService settingsService;

    public PublicSettingsController(SettingsService settingsService) {
        this.settingsService = settingsService;
    }

    @GetMapping
    public SiteSettingsResponse get() {
        return settingsService.get();
    }
}
