package com.syedhasanraihan.portfolio.storage;

import org.springframework.web.multipart.MultipartFile;

/**
 * Abstraction over where uploaded files physically live. {@link LocalDiskStorageService} is the only
 * implementation today; a future S3/Cloudinary implementation is a drop-in swap behind this interface.
 */
public interface StorageService {
    StoredFile store(MultipartFile file, String subfolder);

    void delete(String storedFileName);
}
