package com.syedhasanraihan.portfolio.dto.profile;

import com.syedhasanraihan.portfolio.dto.media.MediaResponse;
import com.syedhasanraihan.portfolio.entity.Profile;

import java.time.Instant;

public record ProfileResponse(
        Long id,
        String fullName,
        String title,
        String tagline,
        String bio,
        String email,
        String phone,
        String location,
        String githubUrl,
        String linkedinUrl,
        String twitterUrl,
        String websiteUrl,
        MediaResponse avatar,
        MediaResponse resume,
        Instant updatedAt
) {
    public static ProfileResponse from(Profile profile) {
        return new ProfileResponse(
                profile.getId(),
                profile.getFullName(),
                profile.getTitle(),
                profile.getTagline(),
                profile.getBio(),
                profile.getEmail(),
                profile.getPhone(),
                profile.getLocation(),
                profile.getGithubUrl(),
                profile.getLinkedinUrl(),
                profile.getTwitterUrl(),
                profile.getWebsiteUrl(),
                MediaResponse.from(profile.getAvatarMedia()),
                MediaResponse.from(profile.getResumeMedia()),
                profile.getUpdatedAt()
        );
    }
}
