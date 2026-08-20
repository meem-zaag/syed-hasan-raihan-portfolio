package com.syedhasanraihan.portfolio.dto.section;

import jakarta.validation.constraints.NotNull;

public record AttachImageRequest(
        @NotNull Long mediaId,
        Integer orderIndex,
        String caption
) {
}
