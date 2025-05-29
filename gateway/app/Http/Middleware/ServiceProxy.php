<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ServiceProxy
{
    private $serviceMap = [
        'profile' => 'http://localhost:8001',
        'playlist' => 'http://localhost:8002', 
        'social' => 'http://localhost:8003',
        'media' => 'http://localhost:8004',
        'comment' => 'http://localhost:8005',
        'analytics' => 'http://localhost:8006'
    ];

    public function handle(Request $request, Closure $next, $service)
    {
        if (!isset($this->serviceMap[$service])) {
            return response()->json(['error' => 'Service not found'], 404);
        }

        $serviceUrl = $this->serviceMap[$service];
        $path = $request->getPathInfo();
        
        // Remove service prefix from path
        $servicePath = preg_replace("/^\/api\/{$service}/", '/api', $path);
        
        $url = $serviceUrl . $servicePath;
        
        try {
            // Forward the request to the appropriate microservice
            $response = Http::withHeaders($this->getForwardHeaders($request))
                ->timeout(30)
                ->{strtolower($request->method())}($url, $request->all());

            return response($response->body(), $response->status())
                ->withHeaders($this->getResponseHeaders($response));

        } catch (\Exception $e) {
            Log::error("Service proxy error for {$service}: " . $e->getMessage());
            return response()->json([
                'error' => 'Service temporarily unavailable',
                'service' => $service
            ], 503);
        }
    }

    private function getForwardHeaders(Request $request)
    {
        $headers = [];
        
        // Forward important headers
        $forwardHeaders = [
            'Authorization',
            'Content-Type',
            'Accept',
            'User-Agent',
            'X-Forwarded-For',
            'X-Real-IP'
        ];

        foreach ($forwardHeaders as $header) {
            if ($request->hasHeader($header)) {
                $headers[$header] = $request->header($header);
            }
        }

        // Add gateway identification
        $headers['X-Gateway'] = 'TuneTrail-Gateway';
        $headers['X-Forwarded-Host'] = $request->getHost();

        return $headers;
    }

    private function getResponseHeaders($response)
    {
        $headers = [];
        
        // Forward response headers
        $forwardHeaders = [
            'Content-Type',
            'Cache-Control',
            'ETag',
            'Last-Modified'
        ];

        foreach ($forwardHeaders as $header) {
            if ($response->hasHeader($header)) {
                $headers[$header] = $response->header($header);
            }
        }

        return $headers;
    }
}
