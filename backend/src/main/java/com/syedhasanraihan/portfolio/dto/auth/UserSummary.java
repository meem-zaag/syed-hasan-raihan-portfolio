package com.syedhasanraihan.portfolio.dto.auth;

import com.syedhasanraihan.portfolio.entity.AdminUser;

public record UserSummary(Long id, String username, String role) {
    public static UserSummary from(AdminUser user) {
        return new UserSummary(user.getId(), user.getUsername(), user.getRole());
    }
}
