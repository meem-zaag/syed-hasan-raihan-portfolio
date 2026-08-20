package com.syedhasanraihan.portfolio.service;

import com.syedhasanraihan.portfolio.common.UnauthorizedException;
import com.syedhasanraihan.portfolio.dto.auth.LoginRequest;
import com.syedhasanraihan.portfolio.dto.auth.TokenPairResponse;
import com.syedhasanraihan.portfolio.dto.auth.UserSummary;
import com.syedhasanraihan.portfolio.entity.AdminUser;
import com.syedhasanraihan.portfolio.entity.RefreshToken;
import com.syedhasanraihan.portfolio.repository.AdminUserRepository;
import com.syedhasanraihan.portfolio.repository.RefreshTokenRepository;
import com.syedhasanraihan.portfolio.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
public class AuthService {

    private final AdminUserRepository adminUserRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AuthService(AdminUserRepository adminUserRepository, RefreshTokenRepository refreshTokenRepository,
                        JwtService jwtService, PasswordEncoder passwordEncoder) {
        this.adminUserRepository = adminUserRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public TokenPairResponse login(LoginRequest request) {
        AdminUser user = adminUserRepository.findByUsername(request.username())
                .orElseThrow(() -> new UnauthorizedException("Invalid username or password"));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new UnauthorizedException("Invalid username or password");
        }

        return issueTokenPair(user);
    }

    @Transactional
    public TokenPairResponse refresh(String rawRefreshToken) {
        String hash = jwtService.hashToken(rawRefreshToken);
        RefreshToken existing = refreshTokenRepository.findByTokenHashAndRevokedFalse(hash)
                .orElseThrow(() -> new UnauthorizedException("Invalid or expired refresh token"));

        if (existing.getExpiresAt().isBefore(Instant.now())) {
            existing.setRevoked(true);
            refreshTokenRepository.save(existing);
            throw new UnauthorizedException("Invalid or expired refresh token");
        }

        existing.setRevoked(true);
        refreshTokenRepository.save(existing);

        return issueTokenPair(existing.getAdminUser());
    }

    private TokenPairResponse issueTokenPair(AdminUser user) {
        String accessToken = jwtService.generateAccessToken(user.getId(), user.getUsername(), user.getRole());

        String rawRefreshToken = jwtService.generateOpaqueRefreshToken();
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setAdminUser(user);
        refreshToken.setTokenHash(jwtService.hashToken(rawRefreshToken));
        refreshToken.setExpiresAt(jwtService.getRefreshTokenExpiry());
        refreshTokenRepository.save(refreshToken);

        return new TokenPairResponse(accessToken, rawRefreshToken, jwtService.getAccessTokenTtlSeconds(),
                UserSummary.from(user));
    }
}
