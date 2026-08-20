package com.syedhasanraihan.portfolio.dto.message;

import com.syedhasanraihan.portfolio.entity.ContactMessage;

import java.time.Instant;

public record ContactMessageResponse(
        Long id,
        String name,
        String email,
        String subject,
        String message,
        boolean read,
        Instant createdAt
) {
    public static ContactMessageResponse from(ContactMessage entity) {
        return new ContactMessageResponse(entity.getId(), entity.getName(), entity.getEmail(),
                entity.getSubject(), entity.getMessage(), entity.isRead(), entity.getCreatedAt());
    }
}
