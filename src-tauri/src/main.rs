// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs;
use serde_json::{json, Value};

#[command]
fn save_game(app_handle: AppHandle, data: String, player_id: String) -> Result<(), String> {
    // Get app data directory using the correct API
    let app_dir = app_handle
        .path_resolver()
        .app_data_dir()
        .ok_or("Failed to get app data directory")?;

    // Create directory if it doesn't exist
    fs::create_dir_all(&app_dir).map_err(|e| format!("Failed to create app data directory: {}", e))?;

    // Create saves directory
    let saves_dir = app_dir.join("saves");
    fs::create_dir_all(&saves_dir).map_err(|e| format!("Failed to create saves directory: {}", e))?;

    // Create database file path
    let db_path = saves_dir.join(format!("{}.db", player_id));

    let conn = Connection::open(&db_path).map_err(|e| format!("Failed to open database: {}", e))?;

    // Create saves table if it doesn't exist
    conn.execute(
        "CREATE TABLE IF NOT EXISTS game_data (
            id INTEGER PRIMARY KEY CHECK (id = 1),
            data TEXT NOT NULL,
            player_id TEXT NOT NULL,
            last_modified INTEGER NOT NULL,
            version TEXT NOT NULL
        )",
        [],
    ).map_err(|e| format!("Failed to create table: {}", e))?;

    // Insert or replace save data
    let timestamp = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .map_err(|e| format!("Failed to get timestamp: {}", e))?
        .as_secs() as i64;

    conn.execute(
        "INSERT OR REPLACE INTO game_data (id, data, player_id, last_modified, version) VALUES (1, ?, ?, ?, ?)",
        &[&data, &player_id, &timestamp.to_string(), &"1.0.0".to_string()],
    ).map_err(|e| format!("Failed to save game data: {}", e))?;

    Ok(())
}

#[command]
fn load_game(app_handle: AppHandle, player_id: String) -> Result<String, String> {
    // Get app data directory using the correct API
    let app_dir = app_handle
        .path_resolver()
        .app_data_dir()
        .ok_or("Failed to get app data directory")?;

    let saves_dir = app_dir.join("saves");
    let db_path = saves_dir.join(format!("{}.db", player_id));

    // Check if save file exists
    if !db_path.exists() {
        return Ok("".to_string());
    }

    let conn = Connection::open(&db_path).map_err(|e| format!("Failed to open database: {}", e))?;

    let mut stmt = conn.prepare(
        "SELECT data FROM game_data WHERE id = 1 AND player_id = ?"
    ).map_err(|e| format!("Failed to prepare statement: {}", e))?;

    let data: String = stmt.query_row([&player_id], |row| row.get(0)).unwrap_or("".to_string());

    Ok(data)
}

// Get local IP address for LAN multiplayer
#[command]
fn get_local_ip() -> Result<String, String> {
    match local_ip() {
        Ok(ip) => Ok(ip.to_string()),
        Err(e) => Err(format!("Failed to get local IP: {}", e))
    }
}

// Anti-cheat functionality
#[command]
fn validate_game_state(_app_handle: AppHandle, _player_id: String, game_state: String) -> Result<bool, String> {
    // Parse game state JSON
    let state: serde_json::Value = serde_json::from_str(&game_state)
        .map_err(|e| format!("Invalid game state JSON: {}", e))?;

    // Basic validation checks
    let wallet = state.get("wallet")
        .and_then(|v| v.as_i64())
        .ok_or("Invalid wallet value")?;

    let bank = state.get("bank")
        .and_then(|v| v.as_i64())
        .ok_or("Invalid bank value")?;

    let level = state.get("profile")
        .and_then(|p| p.get("level"))
        .and_then(|v| v.as_i64())
        .ok_or("Invalid level value")?;

    let xp = state.get("profile")
        .and_then(|p| p.get("xp"))
        .and_then(|v| v.as_i64())
        .ok_or("Invalid XP value")?;

    // Anti-cheat checks
    if wallet < 0 || bank < 0 {
        return Ok(false); // Negative money is suspicious
    }

    if level < 1 || level > 100 {
        return Ok(false); // Invalid level range
    }

    if xp < 0 || xp > 1000000 {
        return Ok(false); // Invalid XP range
    }

    // Check if total earnings make sense for level
    let total_earnings = state.get("profile")
        .and_then(|p| p.get("totalEarnings"))
        .and_then(|v| v.as_i64())
        .unwrap_or(0);

    if total_earnings < 0 || total_earnings > 10000000 {
        return Ok(false); // Invalid earnings range
    }

    Ok(true)
}

#[command]
fn ban_player(app_handle: AppHandle, player_id: String, reason: String) -> Result<(), String> {
    // Get app data directory using the correct API
    let app_dir = app_handle
        .path_resolver()
        .app_data_dir()
        .ok_or("Failed to get app data directory")?;

    let bans_dir = app_dir.join("bans");
    fs::create_dir_all(&bans_dir).map_err(|e| format!("Failed to create bans directory: {}", e))?;

    let ban_file = bans_dir.join(format!("{}.ban", player_id));

    let ban_data = serde_json::json!({
        "player_id": player_id,
        "banned_at": std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .map_err(|e| format!("Failed to get timestamp: {}", e))?
            .as_secs(),
        "reason": reason
    });

    fs::write(&ban_file, serde_json::to_string_pretty(&ban_data)
        .map_err(|e| format!("Failed to serialize ban data: {}", e))?)
        .map_err(|e| format!("Failed to write ban file: {}", e))?;

    Ok(())
}

#[command]
fn is_player_banned(app_handle: AppHandle, player_id: String) -> Result<bool, String> {
    // Get app data directory using the correct API
    let app_dir = app_handle
        .path_resolver()
        .app_data_dir()
        .ok_or("Failed to get app data directory")?;

    let ban_file = app_dir.join("bans").join(format!("{}.ban", player_id));

    Ok(ban_file.exists())
}

#[command]
fn get_ban_reason(app_handle: AppHandle, player_id: String) -> Result<String, String> {
    // Get app data directory using the correct API
    let app_dir = app_handle
        .path_resolver()
        .app_data_dir()
        .ok_or("Failed to get app data directory")?;

    let ban_file = app_dir.join("bans").join(format!("{}.ban", player_id));

    if !ban_file.exists() {
        return Ok("".to_string());
    }

    let ban_content = fs::read_to_string(&ban_file)
        .map_err(|e| format!("Failed to read ban file: {}", e))?;

    let ban_data: serde_json::Value = serde_json::from_str(&ban_content)
        .map_err(|e| format!("Failed to parse ban file: {}", e))?;

    let reason = ban_data.get("reason")
        .and_then(|v| v.as_str())
        .unwrap_or("No reason specified");

    Ok(reason.to_string())
}

#[command]
async fn check_github_updates() -> Result<String, String> {
    // GitHub API endpoint for latest release
    let github_api_url = "https://api.github.com/repos/codenameoperative/what-is-life/releases/latest";

    // Create HTTP client
    let client = reqwest::Client::new();

    // Make the request
    let response = client
        .get(github_api_url)
        .header("User-Agent", "WhatIsLife-Updater/1.0")
        .send()
        .await
        .map_err(|e| format!("Failed to check for updates: {}", e))?;

    if response.status().is_success() {
        let release_data: Value = response
            .json()
            .await
            .map_err(|e| format!("Failed to parse release data: {}", e))?;

        let latest_version = release_data["tag_name"]
            .as_str()
            .unwrap_or("v0.0.0")
            .trim_start_matches('v');

        let current_version = env!("CARGO_PKG_VERSION");

        if latest_version != current_version {
            let changelog_url = release_data["html_url"]
                .as_str()
                .unwrap_or("");

            let update_info = json!({
                "has_update": true,
                "current_version": current_version,
                "latest_version": latest_version,
                "changelog_url": changelog_url,
                "download_url": release_data["assets"][0]["browser_download_url"].as_str().unwrap_or("")
            });

            Ok(update_info.to_string())
        } else {
            Ok(json!({
                "has_update": false,
                "current_version": current_version,
                "latest_version": current_version
            }).to_string())
        }
    } else {
        Err(format!("GitHub API request failed: {}", response.status()))
    }
}

#[command]
async fn download_update(app_handle: AppHandle, version: String) -> Result<String, String> {
    // This would download the update in a real implementation
    // For now, we'll simulate the process
    let app_dir = app_handle
        .path_resolver()
        .app_data_dir()
        .ok_or("Failed to get app data directory")?;

    // Create update directory
    let update_dir = app_dir.join("updates");
    fs::create_dir_all(&update_dir).map_err(|e| format!("Failed to create update directory: {}", e))?;

    // Simulate download (in real implementation, this would download from GitHub releases)
    let update_file = update_dir.join(format!("update_{}.zip", version));
    fs::write(&update_file, "simulated_update_data").map_err(|e| format!("Failed to write update file: {}", e))?;

    Ok(update_file.to_string_lossy().to_string())
}

#[command]
async fn install_update(app_handle: AppHandle, update_path: String) -> Result<bool, String> {
    // In a real implementation, this would:
    // 1. Backup current save data to a safe location
    // 2. Extract and install the update
    // 3. Restore save data from backup
    // 4. Restart the application

    let app_dir = app_handle
        .path_resolver()
        .app_data_dir()
        .ok_or("Failed to get app data directory")?;

    // Create backup directory
    let backup_dir = app_dir.join("backup");
    fs::create_dir_all(&backup_dir).map_err(|e| format!("Failed to create backup directory: {}", e))?;

    // Backup save data
    let saves_dir = app_dir.join("saves");
    let backup_saves_dir = backup_dir.join("saves");

    if saves_dir.exists() {
        // Copy entire saves directory to backup
        copy_dir_recursive(&saves_dir, &backup_saves_dir)
            .map_err(|e| format!("Failed to backup saves: {}", e))?;

        println!("Save data backed up to: {:?}", backup_saves_dir);
    }

    // Backup other important data (settings, etc.)
    let config_dir = app_dir.join("config");
    if config_dir.exists() {
        let backup_config_dir = backup_dir.join("config");
        copy_dir_recursive(&config_dir, &backup_config_dir)
            .map_err(|e| format!("Failed to backup config: {}", e))?;
    }

    // Simulate installation (in real implementation, this would extract and replace files)
    println!("Installing update from: {}", update_path);

    // In a real implementation, this would restart the app
    // For now, we'll just return success
    Ok(true)
}

fn copy_dir_recursive(src: &PathBuf, dst: &PathBuf) -> Result<(), std::io::Error> {
    if !src.exists() {
        return Ok(());
    }

    fs::create_dir_all(dst)?;

    for entry in fs::read_dir(src)? {
        let entry = entry?;
        let src_path = entry.path();
        let dst_path = dst.join(entry.file_name());

        if src_path.is_dir() {
            copy_dir_recursive(&src_path, &dst_path)?;
        } else {
            fs::copy(&src_path, &dst_path)?;
        }
    }

    Ok(())
}

#[command]
fn get_current_version() -> Result<String, String> {
    Ok(env!("CARGO_PKG_VERSION").to_string())
}
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
        save_game,
        load_game,
        validate_game_state,
        ban_player,
        is_player_banned,
        get_ban_reason,
        get_local_ip,
        check_github_updates,
        download_update,
        install_update,
        get_current_version
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
