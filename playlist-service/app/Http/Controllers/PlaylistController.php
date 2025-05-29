<?php

namespace App\Http\Controllers;

use App\Models\Playlist;
use App\Models\PlaylistSong;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PlaylistController extends Controller
{
    public function index(Request $request)
    {
        $playlists = Playlist::where('user_id', $request->user_id)
            ->with('songs')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($playlists);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|integer',
            'title' => 'required|string|max:255',
            'description' => 'sometimes|string|max:500',
            'is_public' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $playlist = Playlist::create([
            'user_id' => $request->user_id,
            'title' => $request->title,
            'description' => $request->description,
            'is_public' => $request->is_public ?? false,
            'total_duration' => 0,
            'total_songs' => 0
        ]);

        return response()->json($playlist, 201);
    }

    public function show($id)
    {
        $playlist = Playlist::with('songs')->findOrFail($id);
        return response()->json($playlist);
    }

    public function update(Request $request, $id)
    {
        $playlist = Playlist::findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string|max:500',
            'is_public' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $playlist->update($request->only(['title', 'description', 'is_public']));

        return response()->json($playlist);
    }

    public function destroy($id)
    {
        $playlist = Playlist::findOrFail($id);
        $playlist->delete();

        return response()->json(['message' => 'Playlist deleted successfully']);
    }

    public function addSong(Request $request, $playlistId)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'artist' => 'required|string|max:255',
            'duration' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $playlist = Playlist::findOrFail($playlistId);
        
        $song = PlaylistSong::create([
            'playlist_id' => $playlistId,
            'title' => $request->title,
            'artist' => $request->artist,
            'album' => $request->album,
            'duration' => $request->duration,
            'spotify_id' => $request->spotify_id,
            'youtube_id' => $request->youtube_id,
            'cover_art' => $request->cover_art,
            'order_index' => $playlist->songs()->count() + 1
        ]);

        // Update playlist totals
        $playlist->increment('total_songs');
        $playlist->increment('total_duration', $request->duration);

        return response()->json($song, 201);
    }

    public function removeSong($playlistId, $songId)
    {
        $song = PlaylistSong::where('playlist_id', $playlistId)
            ->where('id', $songId)
            ->firstOrFail();

        $playlist = Playlist::findOrFail($playlistId);
        
        // Update playlist totals
        $playlist->decrement('total_songs');
        $playlist->decrement('total_duration', $song->duration);

        $song->delete();

        return response()->json(['message' => 'Song removed from playlist']);
    }
}
