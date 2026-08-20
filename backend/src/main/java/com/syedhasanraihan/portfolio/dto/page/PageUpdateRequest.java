package com.syedhasanraihan.portfolio.dto.page;

import jakarta.validation.constraints.NotBlank;

public record PageUpdateRequest(
        @NotBlank String title,
        String metaTitle,
        String metaDescription
) {
}
