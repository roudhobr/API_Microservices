<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ListeningStats extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'song_title',
        'artist',
        'album',
        'genre',
        'listen_count',
        'total_duration',
        'last_listened_at'
    ];

    protected $casts = [
        'listen_count' => 'integer',
        'total_duration' => 'integer',
        'last_listened_at' => 'datetime'
    ];
}
