package com.syedhasanraihan.portfolio.dto.common;

import jakarta.validation.constraints.NotNull;

public record ReorderItem(
        @NotNull Long id,
        @NotNull Integer orderIndex
) {
}
