<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Playlist extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'cover_image',
        'is_public',
        'total_duration',
        'total_songs'
    ];

    protected $casts = [
        'is_public' => 'boolean',
        'total_duration' => 'integer',
        'total_songs' => 'integer'
    ];

    public function songs()
    {
        return $this->hasMany(PlaylistSong::class);
    }
}
