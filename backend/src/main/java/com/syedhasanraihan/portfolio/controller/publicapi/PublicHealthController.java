package com.syedhasanraihan.portfolio.controller.publicapi;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Map;

@RestController
@RequestMapping("/api/public/health")
@Tag(name = "Public - Health")
public class PublicHealthController {

    private final DataSource dataSource;

    public PublicHealthController(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    // Deliberately queries the DB (not just a liveness no-op): Neon suspends its compute
    // independently after 5 min of its own idle time, regardless of whether this app is
    // warm, so the keep-warm pings hitting this endpoint need to touch the DB too or Neon
    // silently goes cold between them. Always returns 200 (never fails Render's deploy
    // health gate) even if the DB check itself fails; "database" just reports what happened.
    @GetMapping
    public Map<String, String> health() {
        String database = "UP";
        try (Connection connection = dataSource.getConnection();
             Statement statement = connection.createStatement()) {
            statement.execute("SELECT 1");
        } catch (SQLException e) {
            database = "DOWN";
        }
        return Map.of("status", "UP", "database", database);
    }
}
