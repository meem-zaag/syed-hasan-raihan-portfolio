package com.syedhasanraihan.portfolio.storage;

import com.syedhasanraihan.portfolio.common.BadRequestException;
import com.syedhasanraihan.portfolio.config.R2Properties;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.net.URI;
import java.nio.file.Path;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

/**
 * Storage backend for hosts with an ephemeral filesystem (e.g. Render's free tier). Talks to
 * Cloudflare R2 via its S3-compatible API. Activated with {@code STORAGE_TYPE=r2}; see
 * {@link R2Properties} for the required env vars.
 */
@Service
@ConditionalOnProperty(prefix = "app.storage", name = "type", havingValue = "r2")
public class R2StorageService implements StorageService {

    private final R2Properties r2Properties;
    private final S3Client s3Client;

    public R2StorageService(R2Properties r2Properties) {
        this.r2Properties = r2Properties;
        this.s3Client = S3Client.builder()
                .endpointOverride(URI.create("https://" + r2Properties.accountId() + ".r2.cloudflarestorage.com"))
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(r2Properties.accessKeyId(), r2Properties.secretAccessKey())))
                // R2 has no notion of AWS regions; "auto" is Cloudflare's documented placeholder value
                // for the S3-compatible API and is never validated against real AWS regions since an
                // endpointOverride is always set.
                .region(Region.of("auto"))
                .forcePathStyle(true)
                .build();
    }

    @Override
    public StoredFile store(MultipartFile file, String subfolder) {
        try {
            String datedSubfolder = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy/MM"));
            String folder = (subfolder == null || subfolder.isBlank()) ? datedSubfolder : subfolder + "/" + datedSubfolder;
            String sanitizedOriginalName = sanitize(file.getOriginalFilename());
            String key = folder + "/" + UUID.randomUUID() + "-" + sanitizedOriginalName;

            s3Client.putObject(
                    PutObjectRequest.builder()
                            .bucket(r2Properties.bucketName())
                            .key(key)
                            .contentType(file.getContentType())
                            .contentLength(file.getSize())
                            .build(),
                    RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

            String url = r2Properties.publicBaseUrl() + "/" + key;
            return new StoredFile(key, url, file.getContentType(), file.getSize());
        } catch (IOException e) {
            throw new BadRequestException("Failed to store uploaded file: " + e.getMessage());
        }
    }

    @Override
    public void delete(String storedFileName) {
        // deleteObject on a missing key is a no-op success per the S3 API contract, matching
        // LocalDiskStorageService's non-fatal-on-missing-file behavior without extra handling.
        s3Client.deleteObject(DeleteObjectRequest.builder()
                .bucket(r2Properties.bucketName())
                .key(storedFileName)
                .build());
    }

    private String sanitize(String originalFilename) {
        if (originalFilename == null || originalFilename.isBlank()) {
            return "file";
        }
        String name = Path.of(originalFilename).getFileName().toString();
        return name.replaceAll("[^a-zA-Z0-9._-]", "_");
    }
}
