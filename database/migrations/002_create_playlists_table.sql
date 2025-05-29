CREATE TABLE playlists (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    cover_image VARCHAR(255) NULL,
    is_public BOOLEAN DEFAULT FALSE,
    total_duration INT DEFAULT 0,
    total_songs INT DEFAULT 0,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);

CREATE TABLE playlist_songs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    playlist_id BIGINT UNSIGNED NOT NULL,
    title VARCHAR(255) NOT NULL,
    artist VARCHAR(255) NOT NULL,
    album VARCHAR(255) NULL,
    duration INT NOT NULL,
    spotify_id VARCHAR(255) NULL,
    youtube_id VARCHAR(255) NULL,
    cover_art VARCHAR(255) NULL,
    order_index INT NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE
);
