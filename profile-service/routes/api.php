<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\HealthController;

// Health check endpoint
Route::get('/health', [HealthController::class, 'check']);

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
