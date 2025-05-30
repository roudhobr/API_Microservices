<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        // Validasi input
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'password' => 'required|string|min:8',
            'username' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Ambil data yang diperlukan saja
        $data = $request->only(['name', 'email', 'password', 'username']);

        try {
            // Kirim request ke service profil
            $response = Http::timeout(30)
                ->withHeaders(['Accept' => 'application/json'])
                ->asJson()
                ->post('http://localhost:8001/api/profile/register', $data);

            if ($response->successful()) {
                return response()->json($response->json(), $response->status());
            } else {
                // Log error response untuk debugging
                \Log::error('Register failed response:', $response->json());
                return response()->json([
                    'message' => 'Registration failed',
                    'errors' => $response->json()
                ], $response->status());
            }
        } catch (\Exception $e) {
            \Log::error('Register exception:', ['error' => $e->getMessage()]);
            return response()->json([
                'message' => 'Registration service unavailable',
                'error' => $e->getMessage()
            ], 503);
        }
    }


    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $response = Http::timeout(30)
                ->withHeaders([
                    'Accept' => 'application/json',
                    'Content-Type' => 'application/json',
                ])
                ->post('http://localhost:8001/api/profile/login', $request->all());

            if ($response->successful()) {
                return response()->json($response->json(), $response->status());
            } else {
                return response()->json([
                    'message' => 'Login failed',
                    'errors' => $response->json()
                ], $response->status());
            }
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Authentication service unavailable',
                'error' => $e->getMessage()
            ], 503);
        }
    }

    public function logout(Request $request)
    {
        $token = $request->bearerToken();

        if ($token) {
            // Clear token from cache
            $cacheKey = 'auth_token:' . hash('sha256', $token);
            cache()->forget($cacheKey);
        }

        return response()->json(['message' => 'Logged out successfully']);
    }

    public function me(Request $request)
    {
        try {
            $response = Http::timeout(30)
                ->withToken($request->bearerToken())
                ->withHeaders([
                    'Accept' => 'application/json',
                ])
                ->get('http://localhost:8001/api/profile/me');

            if ($response->successful()) {
                return response()->json($response->json(), $response->status());
            } else {
                return response()->json([
                    'message' => 'Failed to get user profile'
                ], $response->status());
            }
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Profile service unavailable',
                'error' => $e->getMessage()
            ], 503);
        }
    }
}
