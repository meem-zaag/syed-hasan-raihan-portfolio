package com.syedhasanraihan.portfolio.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Entity
@Table(name = "site_settings")
@Getter
@Setter
@NoArgsConstructor
public class SiteSettings {

    @Id
    private Long id;

    @Column(name = "seo_default_title")
    private String seoDefaultTitle;

    @Column(name = "seo_default_description", columnDefinition = "text")
    private String seoDefaultDescription;

    @Column(name = "theme_accent_color")
    private String themeAccentColor;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}
