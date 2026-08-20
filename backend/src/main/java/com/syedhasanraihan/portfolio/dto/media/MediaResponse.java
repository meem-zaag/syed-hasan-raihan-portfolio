package com.syedhasanraihan.portfolio.dto.media;

import com.syedhasanraihan.portfolio.entity.Media;

import java.time.Instant;

public record MediaResponse(
        Long id,
        String url,
        String originalFileName,
        String contentType,
        long sizeBytes,
        String altText,
        String linkedEntityType,
        Long linkedEntityId,
        Instant uploadedAt
) {
    public static MediaResponse from(Media media) {
        if (media == null) return null;
        return new MediaResponse(
                media.getId(),
                media.getUrl(),
                media.getOriginalFileName(),
                media.getContentType(),
                media.getSizeBytes(),
                media.getAltText(),
                media.getLinkedEntityType(),
                media.getLinkedEntityId(),
                media.getUploadedAt()
        );
    }
}
