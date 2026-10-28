# BusBuddy — Database Architecture & Setup Guide

This directory contains the complete database scripts for the **BusBuddy — Smart Local Bus Information System**.

## 1. Database Overview
- **Database Engine:** MySQL 8.0+
- **Database Name:** `busbuddy_db`
- **Character Set:** `utf8mb4` (Full Unicode support for Tamil characters such as `காந்திபுரம்`)
- **Collation:** `utf8mb4_unicode_ci`

## 2. Table Schemas (`schema.sql`)
The normalized relational schema comprises 9 core tables:

1. `cities` — Master table for supported cities (pilot city: Coimbatore, ID: 1).
2. `stops` — Bus stops with English name (`stop_name_en`), Tamil name (`stop_name_ta`), GPS coordinates (latitude, longitude), and active status.
3. `routes` — Directional route definitions (UP/DOWN or Forward/Return), name, and last verified timestamp.
4. `route_stops` — Many-to-Many junction table establishing ordered sequence (`stop_order`) of stops on each route.
5. `buses` — Bus fleet registration numbers (e.g. 11A, 70, 33A, 90A) and service types (Ordinary, Express, Deluxe, Low Floor AC).
6. `schedules` — Timetable departure timings for buses (labeled DEMO DATA).
7. `fares` — Published government fare slabs between stop pairs along routes.
8. `feedback` — User-submitted reports and correction requests (status: PENDING, REVIEWED, RESOLVED).
9. `admin_users` — Transport administrator credentials with BCrypt password hashes.

## 3. Seed Data (`seed_demo_data.sql`)
Pre-populated with rich, verified Coimbatore transit data:
- **26 Realistic Stops:** Gandhipuram Central, Ukkadam, Singanallur, Railway Station, Peelamedu PSG Tech, Hope College, Town Hall, Ganapathy, Thudiyalur, Saravanampatti IT Park, Eachanari, SITRA Airport Road, etc.
- **14 Directional Routes:** Direct and connecting routes covering major transit corridors.
- **14 Active Buses:** Fleet including Ordinary, Deluxe, Express, and Low Floor AC services.
- **94 Scheduled Timetables:** Hourly and frequent departure times labeled `DEMO DATA`.
- **Default Admin Account:**
  - Username: `admin`
  - Password: `admin123` (BCrypt encoded)

## 4. Manual Setup via MySQL CLI or Workbench

```bash
# Connect to MySQL Server
mysql -u root -p --default-character-set=utf8mb4

# Run schema script
mysql -u root -p --default-character-set=utf8mb4 < schema.sql

# Run seed data script
mysql -u root -p --default-character-set=utf8mb4 < seed_demo_data.sql
```
