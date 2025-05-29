<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PlaylistController;
use App\Http\Controllers\HealthController;

// Health check endpoint
Route::get('/health', [HealthController::class, 'check']);

// Playlist Service Routes
Route::prefix('playlists')->group(function () {
    Route::get('/', [PlaylistController::class, 'index']);
    Route::post('/', [PlaylistController::class, 'store']);
    Route::get('/{id}', [PlaylistController::class, 'show']);
    Route::put('/{id}', [PlaylistController::class, 'update']);
    Route::delete('/{id}', [PlaylistController::class, 'destroy']);
    Route::post('/{id}/songs', [PlaylistController::class, 'addSong']);
    Route::delete('/{playlistId}/songs/{songId}', [PlaylistController::class, 'removeSong']);
});
