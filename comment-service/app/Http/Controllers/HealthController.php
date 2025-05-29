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

        return response()->json([
            'service' => 'comment-service',
            'status' => $status,
            'timestamp' => now()->toISOString(),
            'version' => '1.0.0',
            'checks' => $checks
        ]);
    }
}
