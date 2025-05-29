<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class RequestLogger
{
    public function handle(Request $request, Closure $next)
    {
        $startTime = microtime(true);

        $response = $next($request);

        $endTime = microtime(true);
        $duration = round(($endTime - $startTime) * 1000, 2); // in milliseconds

        // Log request details
        Log::info('Gateway Request', [
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'status_code' => $response->status(),
            'duration_ms' => $duration,
            'user_id' => $request->user_id ?? null
        ]);

        // Update metrics
        $this->updateMetrics($request, $response, $duration);

        // Add response headers
        $response->headers->add([
            'X-Response-Time' => $duration . 'ms',
            'X-Gateway-Version' => '1.0.0'
        ]);

        return $response;
    }

    private function updateMetrics($request, $response, $duration)
    {
        // Increment total requests
        cache()->increment('gateway_requests_total');
        
        // Update requests per minute
        $minute = now()->format('Y-m-d H:i');
        cache()->increment("gateway_requests_minute:{$minute}");
        
        // Update average response time (simple moving average)
        $currentAvg = cache()->get('gateway_avg_response_time', 0);
        $totalRequests = cache()->get('gateway_requests_total', 1);
        $newAvg = (($currentAvg * ($totalRequests - 1)) + $duration) / $totalRequests;
        cache()->put('gateway_avg_response_time', round($newAvg, 2));
        
        // Update error rate
        if ($response->status() >= 400) {
            cache()->increment('gateway_errors_total');
            $errorRate = (cache()->get('gateway_errors_total', 0) / $totalRequests) * 100;
            cache()->put('gateway_error_rate', round($errorRate, 2));
        }
    }
}
