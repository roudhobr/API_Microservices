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

        // Check posts count
        try {
            $postsCount = DB::table('posts')->count();
            $checks['posts_count'] = $postsCount;
        } catch (\Exception $e) {
            $checks['posts_count'] = 'error';
        }

        return response()->json([
            'service' => 'social-service',
            'status' => $status,
            'timestamp' => now()->toISOString(),
            'version' => '1.0.0',
            'checks' => $checks
        ]);
    }
}
