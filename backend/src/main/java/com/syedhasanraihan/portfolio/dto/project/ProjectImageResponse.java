package com.syedhasanraihan.portfolio.dto.project;

import com.syedhasanraihan.portfolio.dto.media.MediaResponse;
import com.syedhasanraihan.portfolio.entity.ProjectImage;

public record ProjectImageResponse(
        Long id,
        MediaResponse media,
        int orderIndex,
        boolean cover
) {
    public static ProjectImageResponse from(ProjectImage image) {
        return new ProjectImageResponse(image.getId(), MediaResponse.from(image.getMedia()),
                image.getOrderIndex(), image.isCover());
    }
}
