package com.syedhasanraihan.portfolio.service;

import com.syedhasanraihan.portfolio.common.NotFoundException;
import com.syedhasanraihan.portfolio.dto.profile.ProfileResponse;
import com.syedhasanraihan.portfolio.dto.profile.ProfileUpdateRequest;
import com.syedhasanraihan.portfolio.entity.Media;
import com.syedhasanraihan.portfolio.entity.Profile;
import com.syedhasanraihan.portfolio.repository.MediaRepository;
import com.syedhasanraihan.portfolio.repository.ProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProfileService {

    private static final Long SINGLETON_ID = 1L;

    private final ProfileRepository profileRepository;
    private final MediaRepository mediaRepository;

    public ProfileService(ProfileRepository profileRepository, MediaRepository mediaRepository) {
        this.profileRepository = profileRepository;
        this.mediaRepository = mediaRepository;
    }

    @Transactional(readOnly = true)
    public ProfileResponse get() {
        return ProfileResponse.from(loadOrCreate());
    }

    @Transactional
    public ProfileResponse update(ProfileUpdateRequest request) {
        Profile profile = loadOrCreate();
        profile.setFullName(request.fullName());
        profile.setTitle(request.title());
        profile.setTagline(request.tagline());
        profile.setBio(request.bio());
        profile.setEmail(request.email());
        profile.setPhone(request.phone());
        profile.setLocation(request.location());
        profile.setGithubUrl(request.githubUrl());
        profile.setLinkedinUrl(request.linkedinUrl());
        profile.setTwitterUrl(request.twitterUrl());
        profile.setWebsiteUrl(request.websiteUrl());
        profile.setAvatarMedia(resolveMedia(request.avatarMediaId()));
        profile.setResumeMedia(resolveMedia(request.resumeMediaId()));
        return ProfileResponse.from(profileRepository.save(profile));
    }

    private Media resolveMedia(Long mediaId) {
        if (mediaId == null) return null;
        return mediaRepository.findById(mediaId).orElseThrow(() -> NotFoundException.of("Media", mediaId));
    }

    private Profile loadOrCreate() {
        return profileRepository.findById(SINGLETON_ID).orElseGet(() -> {
            Profile profile = new Profile();
            profile.setId(SINGLETON_ID);
            return profileRepository.save(profile);
        });
    }
}
