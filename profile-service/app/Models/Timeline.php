<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Timeline extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'song_title',
        'artist',
        'album',
        'listened_at',
        'location',
        'mood',
        'rating',
        'cover_image',
        'audio_snippet'
    ];

    protected $casts = [
        'listened_at' => 'datetime',
        'rating' => 'integer'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
