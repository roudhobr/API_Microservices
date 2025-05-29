<?php

namespace App\Http\Controllers;

use App\Models\UserActivity;
use App\Models\ListeningStats;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    public function trackActivity(Request $request)
    {
        UserActivity::create([
            'user_id' => $request->user_id,
            'activity_type' => $request->activity_type,
            'activity_data' => $request->activity_data ?? [],
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        // Update listening stats if it's a listen activity
        if ($request->activity_type === 'listen') {
            $this->updateListeningStats($request);
        }

        return response()->json(['message' => 'Activity tracked']);
    }

    public function getUserStats(Request $request, $userId)
    {
        $stats = [
            'total_activities' => UserActivity::where('user_id', $userId)->count(),
            'listening_stats' => $this->getListeningStats($userId),
            'activity_breakdown' => $this->getActivityBreakdown($userId),
            'top_genres' => $this->getTopGenres($userId),
            'listening_trends' => $this->getListeningTrends($userId)
        ];

        return response()->json($stats);
    }

    public function getListeningStats($userId)
    {
        return ListeningStats::where('user_id', $userId)
            ->orderBy('listen_count', 'desc')
            ->limit(10)
            ->get();
    }

    public function getActivityBreakdown($userId)
    {
        return UserActivity::where('user_id', $userId)
            ->select('activity_type', DB::raw('count(*) as count'))
            ->groupBy('activity_type')
            ->get();
    }

    public function getTopGenres($userId)
    {
        return ListeningStats::where('user_id', $userId)
            ->whereNotNull('genre')
            ->select('genre', DB::raw('sum(listen_count) as total_listens'))
            ->groupBy('genre')
            ->orderBy('total_listens', 'desc')
            ->limit(5)
            ->get();
    }

    public function getListeningTrends($userId)
    {
        return UserActivity::where('user_id', $userId)
            ->where('activity_type', 'listen')
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('count(*) as listens')
            )
            ->groupBy('date')
            ->orderBy('date', 'desc')
            ->limit(30)
            ->get();
    }

    private function updateListeningStats($request)
    {
        $data = $request->activity_data;
        
        if (!isset($data['song_title']) || !isset($data['artist'])) {
            return;
        }

        $stats = ListeningStats::firstOrCreate(
            [
                'user_id' => $request->user_id,
                'song_title' => $data['song_title'],
                'artist' => $data['artist']
            ],
            [
                'album' => $data['album'] ?? null,
                'genre' => $data['genre'] ?? null,
                'listen_count' => 0,
                'total_duration' => 0
            ]
        );

        $stats->increment('listen_count');
        $stats->increment('total_duration', $data['duration'] ?? 0);
        $stats->update(['last_listened_at' => now()]);
    }
}
