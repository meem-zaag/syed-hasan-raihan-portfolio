package com.syedhasanraihan.portfolio.storage;

import com.syedhasanraihan.portfolio.common.BadRequestException;
import com.syedhasanraihan.portfolio.config.StorageProperties;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
public class LocalDiskStorageService implements StorageService {

    private final StorageProperties storageProperties;

    public LocalDiskStorageService(StorageProperties storageProperties) {
        this.storageProperties = storageProperties;
    }

    @Override
    public StoredFile store(MultipartFile file, String subfolder) {
        try {
            String datedSubfolder = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy/MM"));
            String folder = (subfolder == null || subfolder.isBlank()) ? datedSubfolder : subfolder + "/" + datedSubfolder;

            Path targetDir = Path.of(storageProperties.basePath(), folder).normalize();
            Files.createDirectories(targetDir);

            String sanitizedOriginalName = sanitize(file.getOriginalFilename());
            String storedFileName = folder + "/" + UUID.randomUUID() + "-" + sanitizedOriginalName;
            Path targetFile = Path.of(storageProperties.basePath(), storedFileName).normalize();

            file.transferTo(targetFile);

            String url = storageProperties.publicPath() + "/" + storedFileName;
            return new StoredFile(storedFileName, url, file.getContentType(), file.getSize());
        } catch (IOException e) {
            throw new BadRequestException("Failed to store uploaded file: " + e.getMessage());
        }
    }

    @Override
    public void delete(String storedFileName) {
        try {
            Path targetFile = Path.of(storageProperties.basePath(), storedFileName).normalize();
            Files.deleteIfExists(targetFile);
        } catch (IOException e) {
            // Non-fatal: the DB row is the source of truth; an orphaned file on disk isn't worth
            // failing the delete operation over.
        }
    }

    private String sanitize(String originalFilename) {
        if (originalFilename == null || originalFilename.isBlank()) {
            return "file";
        }
        String name = Path.of(originalFilename).getFileName().toString();
        return name.replaceAll("[^a-zA-Z0-9._-]", "_");
    }
}
