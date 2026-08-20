package com.syedhasanraihan.portfolio.controller.admin;

import com.syedhasanraihan.portfolio.dto.common.PageResult;
import com.syedhasanraihan.portfolio.dto.media.MediaResponse;
import com.syedhasanraihan.portfolio.service.MediaService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin/media")
@Tag(name = "Admin - Media")
@SecurityRequirement(name = "bearerAuth")
public class AdminMediaController {

    private final MediaService mediaService;

    public AdminMediaController(MediaService mediaService) {
        this.mediaService = mediaService;
    }

    @PostMapping(value = "/upload", consumes = "multipart/form-data")
    @ResponseStatus(HttpStatus.CREATED)
    public MediaResponse upload(@RequestParam("file") MultipartFile file,
                                 @RequestParam(required = false) String altText,
                                 @RequestParam(required = false) String linkedEntityType,
                                 @RequestParam(required = false) Long linkedEntityId) {
        return mediaService.upload(file, altText, linkedEntityType, linkedEntityId);
    }

    @GetMapping
    public PageResult<MediaResponse> list(@RequestParam(required = false) String search,
                                           @RequestParam(required = false) String contentType,
                                           Pageable pageable) {
        return mediaService.list(search, contentType, pageable);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        mediaService.delete(id);
    }
}
