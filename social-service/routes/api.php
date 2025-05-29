<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SocialController;
use App\Http\Controllers\HealthController;

// Health check endpoint
Route::get('/health', [HealthController::class, 'check']);

// Social Service Routes
Route::prefix('social')->group(function () {
    Route::get('/feed', [SocialController::class, 'getFeed']);
    Route::post('/posts', [SocialController::class, 'createPost']);
    Route::post('/posts/{id}/like', [SocialController::class, 'likePost']);
    Route::post('/posts/{id}/comment', [SocialController::class, 'commentPost']);
    Route::get('/posts/{id}/comments', [SocialController::class, 'getPostComments']);
});
