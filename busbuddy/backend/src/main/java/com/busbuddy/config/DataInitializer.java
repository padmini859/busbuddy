package com.busbuddy.config;

import com.busbuddy.entity.AdminUser;
import com.busbuddy.repository.AdminUserRepository;
import com.busbuddy.repository.StopRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final AdminUserRepository adminUserRepository;
    private final StopRepository stopRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(AdminUserRepository adminUserRepository,
                           StopRepository stopRepository,
                           PasswordEncoder passwordEncoder) {
        this.adminUserRepository = adminUserRepository;
        this.stopRepository = stopRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        initializeAdminUser();
        logDatabaseStatus();
    }

    private void initializeAdminUser() {
        AdminUser admin = adminUserRepository.findByUsername("admin").orElse(null);
        if (admin == null) {
            logger.info("Default admin user not found. Creating default administrator account...");
            admin = new AdminUser();
            admin.setUsername("admin");
            admin.setPasswordHash(passwordEncoder.encode("admin123"));
            admin.setRole("ROLE_ADMIN");
            admin.setCreatedAt(LocalDateTime.now());
            adminUserRepository.save(admin);
            logger.info("Administrator account created successfully: username='admin'");
        } else {
            // Ensure password hash matches current BCrypt encoder
            admin.setPasswordHash(passwordEncoder.encode("admin123"));
            adminUserRepository.save(admin);
            logger.info("Administrator account 'admin' password hash synchronized.");
        }
    }

    private void logDatabaseStatus() {
        long stopCount = stopRepository.count();
        logger.info("BusBuddy initialized. Total bus stops registered in system: {}", stopCount);
    }
}
