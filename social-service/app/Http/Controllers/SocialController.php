<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\PostLike;
use App\Models\PostComment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SocialController extends Controller
{
    public function getFeed(Request $request)
    {
        $posts = Post::where('is_public', true)
            ->with(['likes', 'comments'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($posts);
    }

    public function createPost(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|integer',
            'type' => 'required|in:timeline,playlist,review',
            'content' => 'required|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $post = Post::create([
            'user_id' => $request->user_id,
            'type' => $request->type,
            'content' => $request->content,
            'media_url' => $request->media_url,
            'song_title' => $request->song_title,
            'artist' => $request->artist,
            'album' => $request->album,
            'playlist_id' => $request->playlist_id,
            'timeline_id' => $request->timeline_id,
            'is_public' => $request->is_public ?? true,
            'likes_count' => 0,
            'comments_count' => 0,
            'shares_count' => 0
        ]);

        return response()->json($post, 201);
    }

    public function likePost(Request $request, $postId)
    {
        $post = Post::findOrFail($postId);
        
        $existingLike = PostLike::where('post_id', $postId)
            ->where('user_id', $request->user_id)
            ->first();

        if ($existingLike) {
            $existingLike->delete();
            $post->decrement('likes_count');
            $liked = false;
        } else {
            PostLike::create([
                'post_id' => $postId,
                'user_id' => $request->user_id
            ]);
            $post->increment('likes_count');
            $liked = true;
        }

        return response()->json([
            'liked' => $liked,
            'likes_count' => $post->fresh()->likes_count
        ]);
    }

    public function commentPost(Request $request, $postId)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|integer',
            'content' => 'required|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $post = Post::findOrFail($postId);

        $comment = PostComment::create([
            'post_id' => $postId,
            'user_id' => $request->user_id,
            'content' => $request->content,
            'parent_id' => $request->parent_id
        ]);

        $post->increment('comments_count');

        return response()->json($comment, 201);
    }

    public function getPostComments($postId)
    {
        $comments = PostComment::where('post_id', $postId)
            ->whereNull('parent_id')
            ->with('replies')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($comments);
    }
}
