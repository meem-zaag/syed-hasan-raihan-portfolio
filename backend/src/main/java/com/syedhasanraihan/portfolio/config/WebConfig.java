package com.syedhasanraihan.portfolio.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final StorageProperties storageProperties;

    public WebConfig(StorageProperties storageProperties) {
        this.storageProperties = storageProperties;
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path baseDir = Path.of(storageProperties.basePath()).toAbsolutePath().normalize();
        try {
            Files.createDirectories(baseDir);
        } catch (IOException e) {
            throw new IllegalStateException("Unable to create storage base path: " + baseDir, e);
        }

        // Built manually (not via Path#toUri()) to guarantee a trailing slash regardless of whether
        // the directory existed yet when this ran — a missing slash silently breaks resource lookups.
        String location = "file:" + baseDir + "/";
        registry.addResourceHandler(storageProperties.publicPath() + "/**")
                .addResourceLocations(location);
    }

    // CORS for /api/** is handled by Spring Security's CorsConfigurationSource bean (see
    // SecurityConfig) since the security filter chain runs before this MVC-level config would apply.
}
