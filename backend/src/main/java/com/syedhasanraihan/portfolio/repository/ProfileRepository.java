package com.syedhasanraihan.portfolio.repository;

import com.syedhasanraihan.portfolio.entity.Profile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfileRepository extends JpaRepository<Profile, Long> {
}
