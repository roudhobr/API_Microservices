<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class GatewayController extends Controller
{
    public function health()
    {
        $services = [
            'profile' => 'http://localhost:8001',
            'playlist' => 'http://localhost:8002',
            'social' => 'http://localhost:8003',
            'media' => 'http://localhost:8004',
            'comment' => 'http://localhost:8005',
            'analytics' => 'http://localhost:8006'
        ];

        $status = [];

        foreach ($services as $name => $url) {
            try {
                $response = Http::timeout(5)->get($url . '/api/health');
                $status[$name] = [
                    'status' => $response->successful() ? 'healthy' : 'unhealthy',
                    'response_time' => $response->transferStats?->getTransferTime() ?? 0,
                    'url' => $url
                ];
            } catch (\Exception $e) {
                $status[$name] = [
                    'status' => 'down',
                    'error' => $e->getMessage(),
                    'url' => $url
                ];
            }
        }

        $overallStatus = collect($status)->every(fn($service) => $service['status'] === 'healthy') 
            ? 'healthy' : 'degraded';

        return response()->json([
            'gateway' => 'healthy',
            'overall_status' => $overallStatus,
            'services' => $status,
            'timestamp' => now()->toISOString()
        ]);
    }

    public function docs()
    {
        return response()->json([
            'name' => 'TuneTrail API Gateway',
            'version' => '1.0.0',
            'description' => 'API Gateway for TuneTrail microservices',
            'services' => [
                'profile' => [
                    'description' => 'User profile and timeline management',
                    'base_url' => '/api/profile',
                    'endpoints' => [
                        'POST /register' => 'Register new user',
                        'POST /login' => 'User login',
                        'GET /me' => 'Get user profile',
                        'PUT /me' => 'Update user profile',
                        'GET /timeline' => 'Get user timeline',
                        'POST /timeline' => 'Add timeline entry'
                    ]
                ],
                'playlist' => [
                    'description' => 'Playlist and song management',
                    'base_url' => '/api/playlist',
                    'endpoints' => [
                        'GET /' => 'Get user playlists',
                        'POST /' => 'Create new playlist',
                        'GET /{id}' => 'Get playlist details',
                        'PUT /{id}' => 'Update playlist',
                        'DELETE /{id}' => 'Delete playlist',
                        'POST /{id}/songs' => 'Add song to playlist',
                        'DELETE /{id}/songs/{songId}' => 'Remove song from playlist'
                    ]
                ],
                'social' => [
                    'description' => 'Social feed and interactions',
                    'base_url' => '/api/social',
                    'endpoints' => [
                        'GET /feed' => 'Get social feed',
                        'POST /posts' => 'Create new post',
                        'POST /posts/{id}/like' => 'Like/unlike post',
                        'POST /posts/{id}/comment' => 'Comment on post',
                        'GET /posts/{id}/comments' => 'Get post comments'
                    ]
                ]
            ]
        ]);
    }

    public function metrics()
    {
        // Basic metrics - in production, use proper monitoring tools
        return response()->json([
            'requests_total' => cache()->get('gateway_requests_total', 0),
            'requests_per_minute' => cache()->get('gateway_requests_per_minute', 0),
            'average_response_time' => cache()->get('gateway_avg_response_time', 0),
            'error_rate' => cache()->get('gateway_error_rate', 0),
            'active_connections' => cache()->get('gateway_active_connections', 0)
        ]);
    }
}
