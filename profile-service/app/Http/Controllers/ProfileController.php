<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Timeline;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class ProfileController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'username' => 'required|string|max:255|unique:users',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'username' => $request->username,
            'bio' => $request->bio,
            'favorite_genres' => $request->favorite_genres ?? [],
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token
        ], 201);
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

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token
        ]);
    }

    public function profile(Request $request)
    {
        return response()->json($request->user());
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();
        
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'bio' => 'sometimes|string|max:500',
            'favorite_genres' => 'sometimes|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user->update($request->only(['name', 'bio', 'favorite_genres']));

        return response()->json($user);
    }

    public function getTimeline(Request $request)
    {
        $user = $request->user();
        $timeline = Timeline::where('user_id', $user->id)
            ->orderBy('listened_at', 'desc')
            ->paginate(20);

        return response()->json($timeline);
    }

    public function addTimelineEntry(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'song_title' => 'required|string|max:255',
            'artist' => 'required|string|max:255',
            'listened_at' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $timeline = Timeline::create([
            'user_id' => $request->user()->id,
            'title' => $request->title,
            'description' => $request->description,
            'song_title' => $request->song_title,
            'artist' => $request->artist,
            'album' => $request->album,
            'listened_at' => $request->listened_at,
            'location' => $request->location,
            'mood' => $request->mood,
            'rating' => $request->rating,
        ]);

        return response()->json($timeline, 201);
    }
}
