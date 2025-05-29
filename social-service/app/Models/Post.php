<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type', // 'timeline', 'playlist', 'review'
        'content',
        'media_url',
        'song_title',
        'artist',
        'album',
        'playlist_id',
        'timeline_id',
        'is_public',
        'likes_count',
        'comments_count',
        'shares_count'
    ];

    protected $casts = [
        'is_public' => 'boolean',
        'likes_count' => 'integer',
        'comments_count' => 'integer',
        'shares_count' => 'integer'
    ];

    public function likes()
    {
        return $this->hasMany(PostLike::class);
    }

    public function comments()
    {
        return $this->hasMany(PostComment::class);
    }
}
