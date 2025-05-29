<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserActivity extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'activity_type', // 'listen', 'like', 'share', 'comment', 'create_playlist'
        'activity_data',
        'ip_address',
        'user_agent',
        'created_at'
    ];

    protected $casts = [
        'activity_data' => 'array',
        'created_at' => 'datetime'
    ];
}
