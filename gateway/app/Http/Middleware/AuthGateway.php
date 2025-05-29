<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class AuthGateway
{
    public function handle(Request $request, Closure $next)
    {
        $token = $request->bearerToken();
        
        if (!$token) {
            return response()->json(['error' => 'Token required'], 401);
        }

        // Check cache first
        $cacheKey = 'auth_token:' . hash('sha256', $token);
        $user = Cache::get($cacheKey);

        if (!$user) {
            // Validate token with profile service
            try {
                $response = Http::withToken($token)
                    ->get('http://localhost:8001/api/profile/me');

                if ($response->successful()) {
                    $user = $response->json();
                    // Cache for 5 minutes
                    Cache::put($cacheKey, $user, 300);
                } else {
                    return response()->json(['error' => 'Invalid token'], 401);
                }
            } catch (\Exception $e) {
                return response()->json(['error' => 'Authentication service unavailable'], 503);
            }
        }

        // Add user info to request
        $request->merge(['user_id' => $user['id']]);
        $request->setUserResolver(function () use ($user) {
            return (object) $user;
        });

        return $next($request);
    }
}
