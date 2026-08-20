package com.syedhasanraihan.portfolio.dto.auth;

public record TokenPairResponse(
        String accessToken,
        String refreshToken,
        long expiresIn,
        UserSummary user
) {
}
