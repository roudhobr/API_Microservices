<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlaylistSong extends Model
{
    use HasFactory;

    protected $fillable = [
        'playlist_id',
        'title',
        'artist',
        'album',
        'duration',
        'spotify_id',
        'youtube_id',
        'cover_art',
        'order_index'
    ];

    protected $casts = [
        'duration' => 'integer',
        'order_index' => 'integer'
    ];

    public function playlist()
    {
        return $this->belongsTo(Playlist::class);
    }
}
