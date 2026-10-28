-- ====================================================================
-- BusBuddy: Smart Local Bus Information System
-- Database Schema (MySQL 8.0+)
-- ====================================================================

CREATE DATABASE IF NOT EXISTS busbuddy_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE busbuddy_db;

-- Drop tables in reverse foreign key order if resetting
DROP TABLE IF EXISTS fares;
DROP TABLE IF EXISTS schedules;
DROP TABLE IF EXISTS buses;
DROP TABLE IF EXISTS route_stops;
DROP TABLE IF EXISTS feedback;
DROP TABLE IF EXISTS routes;
DROP TABLE IF EXISTS stops;
DROP TABLE IF EXISTS cities;
DROP TABLE IF EXISTS admin_users;

-- 1. Cities Table
CREATE TABLE cities (
    city_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    city_name VARCHAR(100) NOT NULL,
    state_name VARCHAR(100) NOT NULL,
    INDEX idx_city_name (city_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Stops Table
CREATE TABLE stops (
    stop_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    city_id BIGINT NOT NULL,
    stop_name_en VARCHAR(150) NOT NULL,
    stop_name_ta VARCHAR(150) NOT NULL,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_stops_city FOREIGN KEY (city_id) REFERENCES cities (city_id) ON DELETE CASCADE,
    INDEX idx_stops_city (city_id),
    INDEX idx_stops_name_en (stop_name_en),
    INDEX idx_stops_name_ta (stop_name_ta)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Routes Table
CREATE TABLE routes (
    route_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    city_id BIGINT NOT NULL,
    route_name VARCHAR(150) NOT NULL,
    direction VARCHAR(50) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    last_verified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_routes_city FOREIGN KEY (city_id) REFERENCES cities (city_id) ON DELETE CASCADE,
    INDEX idx_routes_city (city_id),
    INDEX idx_routes_name (route_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Route Stops Table (Ordered Sequence of Stops on a Route)
CREATE TABLE route_stops (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    route_id BIGINT NOT NULL,
    stop_id BIGINT NOT NULL,
    stop_order INT NOT NULL,
    CONSTRAINT fk_rs_route FOREIGN KEY (route_id) REFERENCES routes (route_id) ON DELETE CASCADE,
    CONSTRAINT fk_rs_stop FOREIGN KEY (stop_id) REFERENCES stops (stop_id) ON DELETE CASCADE,
    UNIQUE KEY uq_route_stop_order (route_id, stop_order),
    UNIQUE KEY uq_route_stop (route_id, stop_id),
    INDEX idx_rs_route (route_id),
    INDEX idx_rs_stop (stop_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Buses Table
CREATE TABLE buses (
    bus_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    bus_number VARCHAR(50) NOT NULL,
    route_id BIGINT NOT NULL,
    service_type VARCHAR(50) NOT NULL DEFAULT 'Ordinary',
    active BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_buses_route FOREIGN KEY (route_id) REFERENCES routes (route_id) ON DELETE CASCADE,
    INDEX idx_buses_number (bus_number),
    INDEX idx_buses_route (route_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Schedules Table
CREATE TABLE schedules (
    schedule_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    bus_id BIGINT NOT NULL,
    departure_time TIME NOT NULL,
    service_day VARCHAR(50) NOT NULL DEFAULT 'Daily',
    source_reference VARCHAR(150) DEFAULT 'DEMO DATA: TNSTC Coimbatore',
    last_verified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_schedules_bus FOREIGN KEY (bus_id) REFERENCES buses (bus_id) ON DELETE CASCADE,
    INDEX idx_schedules_bus (bus_id),
    INDEX idx_schedules_time (departure_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Fares Table
CREATE TABLE fares (
    fare_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    route_id BIGINT NOT NULL,
    source_stop_id BIGINT NOT NULL,
    destination_stop_id BIGINT NOT NULL,
    amount DECIMAL(8, 2) NOT NULL,
    fare_type VARCHAR(50) NOT NULL DEFAULT 'Regular',
    last_verified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_fares_route FOREIGN KEY (route_id) REFERENCES routes (route_id) ON DELETE CASCADE,
    CONSTRAINT fk_fares_source FOREIGN KEY (source_stop_id) REFERENCES stops (stop_id) ON DELETE CASCADE,
    CONSTRAINT fk_fares_dest FOREIGN KEY (destination_stop_id) REFERENCES stops (stop_id) ON DELETE CASCADE,
    INDEX idx_fares_lookup (route_id, source_stop_id, destination_stop_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Feedback Table
CREATE TABLE feedback (
    feedback_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    route_id BIGINT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    contact_info VARCHAR(150) NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_feedback_route FOREIGN KEY (route_id) REFERENCES routes (route_id) ON DELETE SET NULL,
    INDEX idx_feedback_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Admin Users Table
CREATE TABLE admin_users (
    admin_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'ROLE_ADMIN',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
