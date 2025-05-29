<?php

namespace App\Http\Controllers;

use App\Models\Media;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class MediaController extends Controller
{
    public function upload(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'file' => 'required|file|max:10240', // 10MB max
            'user_id' => 'required|integer',
            'type' => 'required|in:image,audio,video',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $file = $request->file('file');
        $type = $request->type;
        
        // Validate file type
        $allowedMimes = [
            'image' => ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
            'audio' => ['audio/mpeg', 'audio/wav', 'audio/ogg'],
            'video' => ['video/mp4', 'video/webm', 'video/ogg']
        ];

        if (!in_array($file->getMimeType(), $allowedMimes[$type])) {
            return response()->json(['error' => 'Invalid file type'], 422);
        }

        // Generate unique filename
        $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
        $path = $type . 's/' . date('Y/m/d') . '/' . $filename;

        // Store file
        $file->storeAs('public/' . dirname($path), basename($path));

        // Get file metadata
        $metadata = $this->getFileMetadata($file, $type);

        // Save to database
        $media = Media::create([
            'user_id' => $request->user_id,
            'filename' => $filename,
            'original_name' => $file->getClientOriginalName(),
            'file_path' => $path,
            'file_size' => $file->getSize(),
            'mime_type' => $file->getMimeType(),
            'file_type' => $type,
            'duration' => $metadata['duration'] ?? null,
            'metadata' => $metadata,
            'is_public' => $request->is_public ?? true
        ]);

        return response()->json([
            'media' => $media,
            'url' => Storage::url($path)
        ], 201);
    }

    public function show($id)
    {
        $media = Media::findOrFail($id);
        
        return response()->json([
            'media' => $media,
            'url' => Storage::url($media->file_path)
        ]);
    }

    public function getUserMedia(Request $request)
    {
        $media = Media::where('user_id', $request->user_id)
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        $media->getCollection()->transform(function ($item) {
            $item->url = Storage::url($item->file_path);
            return $item;
        });

        return response()->json($media);
    }

    public function delete($id)
    {
        $media = Media::findOrFail($id);
        
        // Delete file from storage
        Storage::delete('public/' . $media->file_path);
        
        // Delete from database
        $media->delete();

        return response()->json(['message' => 'Media deleted successfully']);
    }

    private function getFileMetadata($file, $type)
    {
        $metadata = [
            'size' => $file->getSize(),
            'mime_type' => $file->getMimeType()
        ];

        if ($type === 'image') {
            $imageInfo = getimagesize($file->getPathname());
            if ($imageInfo) {
                $metadata['width'] = $imageInfo[0];
                $metadata['height'] = $imageInfo[1];
            }
        }

        // For audio/video, you might want to use FFmpeg or similar
        // This is a basic implementation
        if (in_array($type, ['audio', 'video'])) {
            // You can integrate with FFmpeg here for duration and other metadata
            $metadata['duration'] = 0; // Placeholder
        }

        return $metadata;
    }
}
