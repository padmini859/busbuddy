-- ====================================================================
-- BusBuddy: Demo Seed Data for Coimbatore, Tamil Nadu
-- Note: All schedules and routes are labeled DEMO DATA for academic demonstration.
-- ====================================================================

SET NAMES utf8mb4;
USE busbuddy_db;

-- 1. Insert City
INSERT INTO cities (city_id, city_name, state_name) VALUES
(1, 'Coimbatore', 'Tamil Nadu'),
(2, 'Chennai', 'Tamil Nadu');

-- 2. Insert Bus Stops (Coimbatore)
INSERT INTO stops (stop_id, city_id, stop_name_en, stop_name_ta, latitude, longitude, active) VALUES
(1, 1, 'Gandhipuram Central Bus Stand', 'காந்திபுரம் மத்திய பேருந்து நிலையம்', 11.0168000, 76.9678000, TRUE),
(2, 1, 'Ukkadam Bus Stand', 'உக்கடம் பேருந்து நிலையம்', 10.9890000, 76.9580000, TRUE),
(3, 1, 'Singanallur Bus Stand', 'சிங்கநல்லூர் பேருந்து நிலையம்', 11.0010000, 77.0250000, TRUE),
(4, 1, 'Coimbatore Railway Station', 'கோவை இரயில் நிலையம்', 10.9995000, 76.9632000, TRUE),
(5, 1, 'Town Hall', 'டவுன் ஹால்', 10.9950000, 76.9610000, TRUE),
(6, 1, 'Lakshmi Mills', 'லட்சுமி மில்ஸ்', 11.0135000, 76.9850000, TRUE),
(7, 1, 'Nava India', 'நவ இந்தியா', 11.0190000, 76.9930000, TRUE),
(8, 1, 'Peelamedu / PSG Tech', 'பீளமேடு / பி.எஸ்.ஜி தொழில்நுட்பக் கல்லூரி', 11.0255000, 77.0030000, TRUE),
(9, 1, 'Hope College', 'ஹோப் காலேஜ்', 11.0310000, 77.0190000, TRUE),
(10, 1, 'SITRA / Airport Road', 'சிட்ரா / விமான நிலைய சாலை', 11.0380000, 77.0310000, TRUE),
(11, 1, 'KMCH Hospital', 'கே.எம்.சி.ஹெச் மருத்துவமனை', 11.0420000, 77.0450000, TRUE),
(12, 1, 'Civil Aerodrome (Airport)', 'கோவை சர்வதேச விமான நிலையம்', 11.0300000, 77.0434000, TRUE),
(13, 1, 'Ganapathy', 'கணபதி', 11.0360000, 76.9740000, TRUE),
(14, 1, 'Sivanandha Colony', 'சிவானந்தா காலனி', 11.0280000, 76.9530000, TRUE),
(15, 1, 'Saibaba Colony', 'சாய்பாபா காலனி', 11.0310000, 76.9430000, TRUE),
(16, 1, 'Thudiyalur', 'துடியலூர்', 11.0820000, 76.9480000, TRUE),
(17, 1, 'Saravanampatti', 'சரவணம்பட்டி', 11.0800000, 76.9990000, TRUE),
(18, 1, 'CHIL SEZ IT Park', 'கீல் செஸ் தகவல் தொழில்நுட்ப பூங்கா', 11.0920000, 77.0050000, TRUE),
(19, 1, 'Ramanathapuram', 'இராமநாதபுரம்', 10.9980000, 76.9890000, TRUE),
(20, 1, 'Ondipudur', 'ஒண்டிப்புதூர்', 10.9970000, 77.0480000, TRUE),
(21, 1, 'RS Puram Head Post Office', 'ஆர்.எஸ். புரம் தலைமை அஞ்சலகம்', 11.0080000, 76.9450000, TRUE),
(22, 1, 'Kuniyamuthur', 'குனியமுத்தூர்', 10.9630000, 76.9480000, TRUE),
(23, 1, 'Sundarapuram', 'சுந்தராபுரம்', 10.9520000, 76.9720000, TRUE),
(24, 1, 'Eachanari Temple', 'ஈச்சனாரி கோவில்', 10.9320000, 76.9690000, TRUE),
(25, 1, 'Gandhipuram Town Bus Stand', 'காந்திபுரம் நகரப் பேருந்து நிலையம்', 11.0180000, 76.9655000, TRUE),
(26, 1, 'Coimbatore Medical College (CMC)', 'கோவை மருத்துவக் கல்லூரி', 11.0390000, 77.0380000, TRUE);

-- 3. Insert Routes (Directional)
INSERT INTO routes (route_id, city_id, route_name, direction, active) VALUES
(1, 1, '11A: Gandhipuram to Ukkadam', 'UP', TRUE),
(2, 1, '11A: Ukkadam to Gandhipuram', 'DOWN', TRUE),
(3, 1, '70: Gandhipuram to Singanallur', 'UP', TRUE),
(4, 1, '70: Singanallur to Gandhipuram', 'DOWN', TRUE),
(5, 1, '33A: Ukkadam to Singanallur', 'UP', TRUE),
(6, 1, '33A: Singanallur to Ukkadam', 'DOWN', TRUE),
(7, 1, '90A: Gandhipuram to Saravanampatti IT Park', 'UP', TRUE),
(8, 1, '90A: Saravanampatti IT Park to Gandhipuram', 'DOWN', TRUE),
(9, 1, '102: Gandhipuram to Thudiyalur', 'UP', TRUE),
(10, 1, '102: Thudiyalur to Gandhipuram', 'DOWN', TRUE),
(11, 1, '20C: Ukkadam to Eachanari', 'UP', TRUE),
(12, 1, '20C: Eachanari to Ukkadam', 'DOWN', TRUE),
(13, 1, '45B: Railway Station to KMCH Hospital', 'UP', TRUE),
(14, 1, '45B: KMCH Hospital to Railway Station', 'DOWN', TRUE);

-- 4. Insert Route Stops (Stop sequence order)
-- Route 1 (11A UP): Gandhipuram Central -> Railway Station -> Town Hall -> Ukkadam
INSERT INTO route_stops (route_id, stop_id, stop_order) VALUES
(1, 1, 1),
(1, 4, 2),
(1, 5, 3),
(1, 2, 4);

-- Route 2 (11A DOWN): Ukkadam -> Town Hall -> Railway Station -> Gandhipuram Central
INSERT INTO route_stops (route_id, stop_id, stop_order) VALUES
(2, 2, 1),
(2, 5, 2),
(2, 4, 3),
(2, 1, 4);

-- Route 3 (70 UP): Gandhipuram Central -> Lakshmi Mills -> Nava India -> Peelamedu -> Hope College -> Singanallur
INSERT INTO route_stops (route_id, stop_id, stop_order) VALUES
(3, 1, 1),
(3, 6, 2),
(3, 7, 3),
(3, 8, 4),
(3, 9, 5),
(3, 3, 6);

-- Route 4 (70 DOWN): Singanallur -> Hope College -> Peelamedu -> Nava India -> Lakshmi Mills -> Gandhipuram Central
INSERT INTO route_stops (route_id, stop_id, stop_order) VALUES
(4, 3, 1),
(4, 9, 2),
(4, 8, 3),
(4, 7, 4),
(4, 6, 5),
(4, 1, 6);

-- Route 5 (33A UP): Ukkadam -> Town Hall -> Railway Station -> Ramanathapuram -> Singanallur
INSERT INTO route_stops (route_id, stop_id, stop_order) VALUES
(5, 2, 1),
(5, 5, 2),
(5, 4, 3),
(5, 19, 4),
(5, 3, 5);

-- Route 6 (33A DOWN): Singanallur -> Ramanathapuram -> Railway Station -> Town Hall -> Ukkadam
INSERT INTO route_stops (route_id, stop_id, stop_order) VALUES
(6, 3, 1),
(6, 19, 2),
(6, 4, 3),
(6, 5, 4),
(6, 2, 5);

-- Route 7 (90A UP): Gandhipuram Town -> Ganapathy -> Saravanampatti -> CHIL SEZ
INSERT INTO route_stops (route_id, stop_id, stop_order) VALUES
(7, 25, 1),
(7, 13, 2),
(7, 17, 3),
(7, 18, 4);

-- Route 8 (90A DOWN): CHIL SEZ -> Saravanampatti -> Ganapathy -> Gandhipuram Town
INSERT INTO route_stops (route_id, stop_id, stop_order) VALUES
(8, 18, 1),
(8, 17, 2),
(8, 13, 3),
(8, 25, 4);

-- Route 9 (102 UP): Gandhipuram Central -> Sivanandha Colony -> Saibaba Colony -> Thudiyalur
INSERT INTO route_stops (route_id, stop_id, stop_order) VALUES
(9, 1, 1),
(9, 14, 2),
(9, 15, 3),
(9, 16, 4);

-- Route 10 (102 DOWN): Thudiyalur -> Saibaba Colony -> Sivanandha Colony -> Gandhipuram Central
INSERT INTO route_stops (route_id, stop_id, stop_order) VALUES
(10, 16, 1),
(10, 15, 2),
(10, 14, 3),
(10, 1, 4);

-- Route 11 (20C UP): Ukkadam -> Kuniyamuthur -> Sundarapuram -> Eachanari
INSERT INTO route_stops (route_id, stop_id, stop_order) VALUES
(11, 2, 1),
(11, 22, 2),
(11, 23, 3),
(11, 24, 4);

-- Route 12 (20C DOWN): Eachanari -> Sundarapuram -> Kuniyamuthur -> Ukkadam
INSERT INTO route_stops (route_id, stop_id, stop_order) VALUES
(12, 24, 1),
(12, 23, 2),
(12, 22, 3),
(12, 2, 4);

-- Route 13 (45B UP): Railway Station -> Lakshmi Mills -> Peelamedu -> Hope College -> SITRA -> KMCH Hospital
INSERT INTO route_stops (route_id, stop_id, stop_order) VALUES
(13, 4, 1),
(13, 6, 2),
(13, 8, 3),
(13, 9, 4),
(13, 10, 5),
(13, 11, 6);

-- Route 14 (45B DOWN): KMCH Hospital -> SITRA -> Hope College -> Peelamedu -> Lakshmi Mills -> Railway Station
INSERT INTO route_stops (route_id, stop_id, stop_order) VALUES
(14, 11, 1),
(14, 10, 2),
(14, 9, 3),
(14, 8, 4),
(14, 6, 5),
(14, 4, 6);

-- 5. Insert Buses
INSERT INTO buses (bus_id, bus_number, route_id, service_type, active) VALUES
(1, '11A', 1, 'Ordinary', TRUE),
(2, '11A', 2, 'Ordinary', TRUE),
(3, '70', 3, 'Deluxe', TRUE),
(4, '70', 4, 'Deluxe', TRUE),
(5, '33A', 5, 'Ordinary', TRUE),
(6, '33A', 6, 'Ordinary', TRUE),
(7, '90A', 7, 'Low Floor AC', TRUE),
(8, '90A', 8, 'Low Floor AC', TRUE),
(9, '102', 9, 'Ordinary', TRUE),
(10, '102', 10, 'Ordinary', TRUE),
(11, '20C', 11, 'Ordinary', TRUE),
(12, '20C', 12, 'Ordinary', TRUE),
(13, '45B', 13, 'Express', TRUE),
(14, '45B', 14, 'Express', TRUE);

-- 6. Insert Schedules (Demo Timetables)
INSERT INTO schedules (bus_id, departure_time, service_day, source_reference) VALUES
-- Bus 11A UP (Gandhipuram to Ukkadam)
(1, '06:00:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(1, '07:15:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(1, '08:30:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(1, '10:00:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(1, '12:00:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(1, '14:30:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(1, '16:45:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(1, '18:15:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(1, '20:00:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),

-- Bus 11A DOWN (Ukkadam to Gandhipuram)
(2, '06:35:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(2, '07:50:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(2, '09:05:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(2, '10:35:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(2, '12:35:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(2, '15:05:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(2, '17:20:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(2, '18:50:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(2, '20:35:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),

-- Bus 70 UP (Gandhipuram to Singanallur)
(3, '06:15:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(3, '07:30:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(3, '08:45:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(3, '11:00:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(3, '13:30:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(3, '15:45:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(3, '17:30:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(3, '19:15:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),

-- Bus 70 DOWN (Singanallur to Gandhipuram)
(4, '07:00:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(4, '08:15:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(4, '09:30:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(4, '11:45:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(4, '14:15:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(4, '16:30:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(4, '18:15:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(4, '20:00:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),

-- Bus 33A UP (Ukkadam to Singanallur)
(5, '06:30:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(5, '08:00:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(5, '10:15:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(5, '13:00:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(5, '15:30:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(5, '18:00:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),

-- Bus 33A DOWN (Singanallur to Ukkadam)
(6, '07:15:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(6, '08:45:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(6, '11:00:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(6, '13:45:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(6, '16:15:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(6, '18:45:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),

-- Bus 90A UP (Gandhipuram to Saravanampatti IT Park)
(7, '07:00:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(7, '08:15:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(7, '09:30:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(7, '12:00:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(7, '16:00:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(7, '17:45:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(7, '19:30:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),

-- Bus 90A DOWN (Saravanampatti to Gandhipuram)
(8, '07:45:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(8, '09:00:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(8, '10:15:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(8, '12:45:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(8, '16:45:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(8, '18:30:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(8, '20:15:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),

-- Bus 102 UP (Gandhipuram to Thudiyalur)
(9, '06:45:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(9, '08:00:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(9, '10:30:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(9, '14:00:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(9, '17:15:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(9, '19:45:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),

-- Bus 102 DOWN (Thudiyalur to Gandhipuram)
(10, '07:30:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(10, '08:45:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(10, '11:15:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(10, '14:45:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(10, '18:00:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(10, '20:30:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),

-- Bus 20C UP (Ukkadam to Eachanari)
(11, '06:00:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(11, '08:30:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(11, '11:30:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(11, '15:00:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(11, '18:30:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),

-- Bus 20C DOWN (Eachanari to Ukkadam)
(12, '07:00:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(12, '09:30:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(12, '12:30:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(12, '16:00:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(12, '19:30:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),

-- Bus 45B UP (Railway Station to KMCH)
(13, '07:15:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(13, '09:00:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(13, '11:30:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(13, '14:15:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(13, '16:45:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(13, '19:15:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),

-- Bus 45B DOWN (KMCH to Railway Station)
(14, '08:00:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(14, '09:45:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(14, '12:15:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(14, '15:00:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(14, '17:30:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division'),
(14, '20:00:00', 'Daily', 'DEMO DATA: TNSTC Coimbatore Division');

-- 7. Insert Published Sample Fares
INSERT INTO fares (route_id, source_stop_id, destination_stop_id, amount, fare_type) VALUES
-- Route 1 (11A UP)
(1, 1, 4, 7.00, 'Regular'),
(1, 1, 5, 10.00, 'Regular'),
(1, 1, 2, 12.00, 'Regular'),
(1, 4, 2, 8.00, 'Regular'),
-- Route 2 (11A DOWN)
(2, 2, 5, 6.00, 'Regular'),
(2, 2, 4, 8.00, 'Regular'),
(2, 2, 1, 12.00, 'Regular'),
-- Route 3 (70 UP)
(3, 1, 6, 6.00, 'Regular'),
(3, 1, 7, 8.00, 'Regular'),
(3, 1, 8, 10.00, 'Regular'),
(3, 1, 9, 12.00, 'Regular'),
(3, 1, 3, 15.00, 'Regular'),
-- Route 4 (70 DOWN)
(4, 3, 9, 7.00, 'Regular'),
(4, 3, 8, 9.00, 'Regular'),
(4, 3, 1, 15.00, 'Regular'),
-- Route 5 (33A UP)
(5, 2, 4, 8.00, 'Regular'),
(5, 2, 19, 11.00, 'Regular'),
(5, 2, 3, 15.00, 'Regular'),
-- Route 7 (90A UP)
(7, 25, 13, 8.00, 'Regular'),
(7, 25, 17, 14.00, 'Regular'),
(7, 25, 18, 16.00, 'Regular'),
-- Route 9 (102 UP)
(9, 1, 14, 7.00, 'Regular'),
(9, 1, 15, 9.00, 'Regular'),
(9, 1, 16, 14.00, 'Regular'),
-- Route 11 (20C UP)
(11, 2, 22, 7.00, 'Regular'),
(11, 2, 23, 10.00, 'Regular'),
(11, 2, 24, 13.00, 'Regular'),
-- Route 13 (45B UP)
(13, 4, 8, 10.00, 'Regular'),
(13, 4, 10, 14.00, 'Regular'),
(13, 4, 11, 16.00, 'Regular');

-- 8. Insert Feedback
INSERT INTO feedback (route_id, category, description, contact_info, status) VALUES
(1, 'Schedule Clarification', 'Bus 11A from Gandhipuram was very punctual during morning peak hours.', 'passenger.kovai@gmail.com', 'RESOLVED'),
(3, 'Incorrect stop', 'Hope College bus shelter is temporarily shifted 50m ahead due to bridge work.', 'selvam.tnstc@yahoo.com', 'PENDING'),
(7, 'Missing bus', 'Please increase frequency of 90A low-floor AC buses to Saravanampatti IT corridor.', 'techie99@gmail.com', 'REVIEWED');

-- 9. Insert Admin User (Password is admin123 hashed with BCrypt)
-- Hash: $2a$10$w3r8L8t1G46k3yP218vY3O2Vb7H1qE3T7S5u.V2e9L2g8K7H3R9mK (admin123)
INSERT INTO admin_users (admin_id, username, password_hash, role) VALUES
(1, 'admin', '$2a$10$w3r8L8t1G46k3yP218vY3O2Vb7H1qE3T7S5u.V2e9L2g8K7H3R9mK', 'ROLE_ADMIN');
