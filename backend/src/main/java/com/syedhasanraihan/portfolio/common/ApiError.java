package com.syedhasanraihan.portfolio.common;

import java.time.Instant;
import java.util.List;

public record ApiError(
        Instant timestamp,
        int status,
        String error,
        String message,
        String path,
        List<FieldValidationError> validationErrors
) {
    public static ApiError of(int status, String error, String message, String path) {
        return new ApiError(Instant.now(), status, error, message, path, null);
    }

    public static ApiError withValidation(int status, String error, String message, String path,
                                           List<FieldValidationError> validationErrors) {
        return new ApiError(Instant.now(), status, error, message, path, validationErrors);
    }
}
