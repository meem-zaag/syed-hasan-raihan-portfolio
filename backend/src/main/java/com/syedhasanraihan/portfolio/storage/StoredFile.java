package com.syedhasanraihan.portfolio.storage;

public record StoredFile(
        String storedFileName,
        String url,
        String contentType,
        long sizeBytes
) {
}
