package com.syedhasanraihan.portfolio.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Entity
@Table(name = "profile")
@Getter
@Setter
@NoArgsConstructor
public class Profile {

    @Id
    private Long id;

    @Column(name = "full_name")
    private String fullName;

    private String title;

    private String tagline;

    @Column(columnDefinition = "text")
    private String bio;

    private String email;

    private String phone;

    private String location;

    @Column(name = "github_url")
    private String githubUrl;

    @Column(name = "linkedin_url")
    private String linkedinUrl;

    @Column(name = "twitter_url")
    private String twitterUrl;

    @Column(name = "website_url")
    private String websiteUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "avatar_media_id")
    private Media avatarMedia;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_media_id")
    private Media resumeMedia;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}
