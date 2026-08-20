package com.syedhasanraihan.portfolio.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.List;

@ConfigurationProperties(prefix = "app.storage")
public record StorageProperties(
        String type,
        String basePath,
        String publicPath,
        long maxFileSizeBytes,
        List<String> allowedContentTypes
) {
}
