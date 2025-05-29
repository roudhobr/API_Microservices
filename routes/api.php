<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PlaylistController;
use App\Http\Controllers\SocialController;

// Profile Service Routes
Route::prefix('profile')->group(function () {
    Route::post('/register', [ProfileController::class, 'register']);
    Route::post('/login', [ProfileController::class, 'login']);
    
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [ProfileController::class, 'profile']);
        Route::put('/me', [ProfileController::class, 'updateProfile']);
        Route::get('/timeline', [ProfileController::class, 'getTimeline']);
        Route::post('/timeline', [ProfileController::class, 'addTimelineEntry']);
    });
});

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

// Social Service Routes
Route::prefix('social')->group(function () {
    Route::get('/feed', [SocialController::class, 'getFeed']);
    Route::post('/posts', [SocialController::class, 'createPost']);
    Route::post('/posts/{id}/like', [SocialController::class, 'likePost']);
    Route::post('/posts/{id}/comment', [SocialController::class, 'commentPost']);
    Route::get('/posts/{id}/comments', [SocialController::class, 'getPostComments']);
});
