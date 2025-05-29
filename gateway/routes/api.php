<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GatewayController;
use App\Http\Controllers\AuthController;
use App\Http\Middleware\ServiceProxy;
use App\Http\Middleware\AuthGateway;
use App\Http\Middleware\RateLimiter;
use App\Http\Middleware\RequestLogger;

// Gateway management routes
Route::get('/health', [GatewayController::class, 'health']);
Route::get('/docs', [GatewayController::class, 'docs']);
Route::get('/metrics', [GatewayController::class, 'metrics']);

// Authentication routes (direct to gateway) - NO CSRF
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware(AuthGateway::class);
    Route::get('/me', [AuthController::class, 'me'])->middleware(AuthGateway::class);
});

// Apply global middleware
Route::middleware([RequestLogger::class, RateLimiter::class . ':100,1'])->group(function () {
    
    // Profile Service Routes
    Route::prefix('profile')->middleware([ServiceProxy::class . ':profile'])->group(function () {
        Route::any('/timeline', function () {})->middleware(AuthGateway::class);
        Route::any('/me', function () {})->middleware(AuthGateway::class);
        Route::any('/{any}', function () {})->where('any', '.*');
    });

    // Playlist Service Routes
    Route::prefix('playlist')->middleware([AuthGateway::class, ServiceProxy::class . ':playlist'])->group(function () {
        Route::any('/{any?}', function () {})->where('any', '.*');
    });

    // Social Service Routes
    Route::prefix('social')->middleware([ServiceProxy::class . ':social'])->group(function () {
        Route::any('/feed', function () {});
        Route::any('/posts/{id}/like', function () {})->middleware(AuthGateway::class);
        Route::any('/posts/{id}/comment', function () {})->middleware(AuthGateway::class);
        Route::any('/posts', function () {})->middleware(AuthGateway::class);
        Route::any('/{any}', function () {})->where('any', '.*');
    });

    // Media Service Routes
    Route::prefix('media')->middleware([AuthGateway::class, ServiceProxy::class . ':media'])->group(function () {
        Route::any('/{any?}', function () {})->where('any', '.*');
    });

    // Comment Service Routes
    Route::prefix('comment')->middleware([ServiceProxy::class . ':comment'])->group(function () {
        Route::any('/{any?}', function () {})->where('any', '.*');
    });

    // Analytics Service Routes
    Route::prefix('analytics')->middleware([AuthGateway::class, ServiceProxy::class . ':analytics'])->group(function () {
        Route::any('/{any?}', function () {})->where('any', '.*');
    });
});

// Catch-all route for undefined endpoints
Route::fallback(function () {
    return response()->json([
        'error' => 'Endpoint not found',
        'available_services' => [
            'profile', 'playlist', 'social', 'media', 'comment', 'analytics'
        ]
    ], 404);
});
