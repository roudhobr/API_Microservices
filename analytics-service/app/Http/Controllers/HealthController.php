<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class HealthController extends Controller
{
    public function check()
    {
        $status = 'healthy';
        $checks = [];

        // Database check
        try {
            DB::connection()->getPdo();
            $checks['database'] = 'healthy';
        } catch (\Exception $e) {
            $checks['database'] = 'unhealthy';
            $status = 'unhealthy';
        }

        // Cache check
        try {
            cache()->put('health_check', 'ok', 10);
            $cacheValue = cache()->get('health_check');
            $checks['cache'] = $cacheValue === 'ok' ? 'healthy' : 'unhealthy';
        } catch (\Exception $e) {
            $checks['cache'] = 'unhealthy';
        }

        return response()->json([
            'service' => 'analytics-service',
            'status' => $status,
            'timestamp' => now()->toISOString(),
            'version' => '1.0.0',
            'checks' => $checks
        ]);
    }
}
