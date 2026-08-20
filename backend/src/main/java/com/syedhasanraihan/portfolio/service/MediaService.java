package com.syedhasanraihan.portfolio.service;

import com.syedhasanraihan.portfolio.common.BadRequestException;
import com.syedhasanraihan.portfolio.common.NotFoundException;
import com.syedhasanraihan.portfolio.config.StorageProperties;
import com.syedhasanraihan.portfolio.dto.common.PageResult;
import com.syedhasanraihan.portfolio.dto.media.MediaResponse;
import com.syedhasanraihan.portfolio.entity.Media;
import com.syedhasanraihan.portfolio.repository.*;
import com.syedhasanraihan.portfolio.storage.StorageService;
import com.syedhasanraihan.portfolio.storage.StoredFile;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class MediaService {

    private final MediaRepository mediaRepository;
    private final StorageService storageService;
    private final StorageProperties storageProperties;
    private final ProfileRepository profileRepository;
    private final ExperienceRepository experienceRepository;
    private final SectionImageRepository sectionImageRepository;
    private final ProjectImageRepository projectImageRepository;

    public MediaService(MediaRepository mediaRepository, StorageService storageService,
                         StorageProperties storageProperties, ProfileRepository profileRepository,
                         ExperienceRepository experienceRepository, SectionImageRepository sectionImageRepository,
                         ProjectImageRepository projectImageRepository) {
        this.mediaRepository = mediaRepository;
        this.storageService = storageService;
        this.storageProperties = storageProperties;
        this.profileRepository = profileRepository;
        this.experienceRepository = experienceRepository;
        this.sectionImageRepository = sectionImageRepository;
        this.projectImageRepository = projectImageRepository;
    }

    @Transactional
    public MediaResponse upload(MultipartFile file, String altText, String linkedEntityType, Long linkedEntityId) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("No file was uploaded");
        }
        if (file.getSize() > storageProperties.maxFileSizeBytes()) {
            throw new BadRequestException("File exceeds the maximum allowed size of "
                    + (storageProperties.maxFileSizeBytes() / (1024 * 1024)) + "MB");
        }
        String contentType = file.getContentType();
        if (contentType == null || !storageProperties.allowedContentTypes().contains(contentType)) {
            throw new BadRequestException("Unsupported file type: " + contentType);
        }

        StoredFile stored = storageService.store(file, null);

        Media media = new Media();
        media.setStoredFileName(stored.storedFileName());
        media.setOriginalFileName(file.getOriginalFilename());
        media.setUrl(stored.url());
        media.setContentType(stored.contentType());
        media.setSizeBytes(stored.sizeBytes());
        media.setAltText(altText);
        media.setLinkedEntityType(linkedEntityType);
        media.setLinkedEntityId(linkedEntityId);

        return MediaResponse.from(mediaRepository.save(media));
    }

    @Transactional(readOnly = true)
    public PageResult<MediaResponse> list(String search, String contentType, Pageable pageable) {
        return PageResult.from(mediaRepository.search(search, contentType, pageable), MediaResponse::from);
    }

    @Transactional
    public void delete(Long id) {
        Media media = mediaRepository.findById(id).orElseThrow(() -> NotFoundException.of("Media", id));

        profileRepository.findAll().forEach(profile -> {
            boolean touched = false;
            if (profile.getAvatarMedia() != null && profile.getAvatarMedia().getId().equals(id)) {
                profile.setAvatarMedia(null);
                touched = true;
            }
            if (profile.getResumeMedia() != null && profile.getResumeMedia().getId().equals(id)) {
                profile.setResumeMedia(null);
                touched = true;
            }
            if (touched) {
                profileRepository.save(profile);
            }
        });

        experienceRepository.findAll().forEach(experience -> {
            if (experience.getCompanyLogoMedia() != null && experience.getCompanyLogoMedia().getId().equals(id)) {
                experience.setCompanyLogoMedia(null);
                experienceRepository.save(experience);
            }
        });

        sectionImageRepository.deleteByMediaId(id);
        projectImageRepository.deleteByMediaId(id);

        mediaRepository.delete(media);
        storageService.delete(media.getStoredFileName());
    }
}
