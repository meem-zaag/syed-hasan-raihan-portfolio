package com.syedhasanraihan.portfolio.controller.admin;

import com.syedhasanraihan.portfolio.dto.settings.SiteSettingsRequest;
import com.syedhasanraihan.portfolio.dto.settings.SiteSettingsResponse;
import com.syedhasanraihan.portfolio.service.SettingsService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/settings")
@Tag(name = "Admin - Settings")
@SecurityRequirement(name = "bearerAuth")
public class AdminSettingsController {

    private final SettingsService settingsService;

    public AdminSettingsController(SettingsService settingsService) {
        this.settingsService = settingsService;
    }

    @GetMapping
    public SiteSettingsResponse get() {
        return settingsService.get();
    }

    @PutMapping
    public SiteSettingsResponse update(@RequestBody SiteSettingsRequest request) {
        return settingsService.update(request);
    }
}
