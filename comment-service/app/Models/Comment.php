<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'commentable_type', // 'post', 'playlist', 'timeline'
        'commentable_id',
        'content',
        'parent_id',
        'likes_count',
        'replies_count'
    ];

    protected $casts = [
        'likes_count' => 'integer',
        'replies_count' => 'integer'
    ];

    public function replies()
    {
        return $this->hasMany(Comment::class, 'parent_id');
    }

    public function parent()
    {
        return $this->belongsTo(Comment::class, 'parent_id');
    }

    public function likes()
    {
        return $this->hasMany(CommentLike::class);
    }
}
