<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Media extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'filename',
        'original_name',
        'file_path',
        'file_size',
        'mime_type',
        'file_type', // 'image', 'audio', 'video'
        'duration', // for audio/video
        'metadata',
        'is_public'
    ];

    protected $casts = [
        'metadata' => 'array',
        'is_public' => 'boolean',
        'file_size' => 'integer',
        'duration' => 'integer'
    ];
}
