<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\RateLimiter as LaravelRateLimiter;

class RateLimiter
{
    public function handle(Request $request, Closure $next, $maxAttempts = 60, $decayMinutes = 1)
    {
        $key = $this->resolveRequestSignature($request);

        if (LaravelRateLimiter::tooManyAttempts($key, $maxAttempts)) {
            return response()->json([
                'error' => 'Too many requests',
                'retry_after' => LaravelRateLimiter::availableIn($key)
            ], 429);
        }

        LaravelRateLimiter::hit($key, $decayMinutes * 60);

        $response = $next($request);

        // Add rate limit headers
        $response->headers->add([
            'X-RateLimit-Limit' => $maxAttempts,
            'X-RateLimit-Remaining' => LaravelRateLimiter::remaining($key, $maxAttempts),
            'X-RateLimit-Reset' => LaravelRateLimiter::availableIn($key)
        ]);

        return $response;
    }

    protected function resolveRequestSignature(Request $request)
    {
        $user = $request->user();
        
        if ($user) {
            return 'rate_limit:user:' . $user->id;
        }

        return 'rate_limit:ip:' . $request->ip();
    }
}
