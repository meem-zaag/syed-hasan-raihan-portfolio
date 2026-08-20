package com.syedhasanraihan.portfolio.dto.profile;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ProfileUpdateRequest(
        @NotBlank @Size(max = 150) String fullName,
        @Size(max = 200) String title,
        @Size(max = 250) String tagline,
        String bio,
        @Email String email,
        @Size(max = 30) String phone,
        @Size(max = 150) String location,
        String githubUrl,
        String linkedinUrl,
        String twitterUrl,
        String websiteUrl,
        Long avatarMediaId,
        Long resumeMediaId
) {
}
