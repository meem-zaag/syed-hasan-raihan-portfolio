package com.syedhasanraihan.portfolio.dto.common;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record ReorderRequest(
        @NotEmpty @Valid List<ReorderItem> items
) {
}
