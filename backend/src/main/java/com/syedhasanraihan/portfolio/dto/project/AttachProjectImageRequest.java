package com.syedhasanraihan.portfolio.dto.project;

import jakarta.validation.constraints.NotNull;

public record AttachProjectImageRequest(
        @NotNull Long mediaId,
        Integer orderIndex,
        Boolean cover
) {
}
