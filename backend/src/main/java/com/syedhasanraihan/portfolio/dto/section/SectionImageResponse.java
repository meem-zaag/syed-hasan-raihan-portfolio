package com.syedhasanraihan.portfolio.dto.section;

import com.syedhasanraihan.portfolio.dto.media.MediaResponse;
import com.syedhasanraihan.portfolio.entity.SectionImage;

public record SectionImageResponse(
        Long id,
        MediaResponse media,
        int orderIndex,
        String caption
) {
    public static SectionImageResponse from(SectionImage image) {
        return new SectionImageResponse(image.getId(), MediaResponse.from(image.getMedia()),
                image.getOrderIndex(), image.getCaption());
    }
}
