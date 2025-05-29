-- Setup script untuk semua database TuneTrail
-- Jalankan di phpMyAdmin atau MySQL command line

-- Drop databases jika sudah ada (hati-hati!)
-- DROP DATABASE IF EXISTS tunetrail_gateway;
-- DROP DATABASE IF EXISTS tunetrail_profile;
-- DROP DATABASE IF EXISTS tunetrail_playlist;
-- DROP DATABASE IF EXISTS tunetrail_social;
-- DROP DATABASE IF EXISTS tunetrail_media;
-- DROP DATABASE IF EXISTS tunetrail_comment;
-- DROP DATABASE IF EXISTS tunetrail_analytics;

-- Buat semua database
CREATE DATABASE IF NOT EXISTS tunetrail_gateway;
CREATE DATABASE IF NOT EXISTS tunetrail_profile;
CREATE DATABASE IF NOT EXISTS tunetrail_playlist;
CREATE DATABASE IF NOT EXISTS tunetrail_social;
CREATE DATABASE IF NOT EXISTS tunetrail_media;
CREATE DATABASE IF NOT EXISTS tunetrail_comment;
CREATE DATABASE IF NOT EXISTS tunetrail_analytics;

-- Tampilkan database yang sudah dibuat
SHOW DATABASES LIKE 'tunetrail_%';
