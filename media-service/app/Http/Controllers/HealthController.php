<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class HealthController extends Controller
{
    public function check()
    {
        $status = 'healthy';
        $checks = [];

        // Storage check
        try {
            $diskSpace = disk_free_space(storage_path());
            $totalSpace = disk_total_space(storage_path());
            $usedPercent = (($totalSpace - $diskSpace) / $totalSpace) * 100;
            
            $checks['storage'] = [
                'status' => $usedPercent < 90 ? 'healthy' : 'warning',
                'free_gb' => round($diskSpace / 1024 / 1024 / 1024, 2),
                'total_gb' => round($totalSpace / 1024 / 1024 / 1024, 2),
                'used_percent' => round($usedPercent, 2)
            ];
        } catch (\Exception $e) {
            $checks['storage'] = 'error';
            $status = 'unhealthy';
        }

        return response()->json([
            'service' => 'media-service',
            'status' => $status,
            'timestamp' => now()->toISOString(),
            'version' => '1.0.0',
            'checks' => $checks
        ]);
    }
}
