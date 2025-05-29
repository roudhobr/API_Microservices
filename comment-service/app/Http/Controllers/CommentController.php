<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\CommentLike;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CommentController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|integer',
            'commentable_type' => 'required|in:post,playlist,timeline',
            'commentable_id' => 'required|integer',
            'content' => 'required|string|max:1000',
            'parent_id' => 'sometimes|integer|exists:comments,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $comment = Comment::create([
            'user_id' => $request->user_id,
            'commentable_type' => $request->commentable_type,
            'commentable_id' => $request->commentable_id,
            'content' => $request->content,
            'parent_id' => $request->parent_id,
            'likes_count' => 0,
            'replies_count' => 0
        ]);

        // Update parent comment replies count
        if ($request->parent_id) {
            Comment::where('id', $request->parent_id)->increment('replies_count');
        }

        return response()->json($comment, 201);
    }

    public function getComments(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'commentable_type' => 'required|in:post,playlist,timeline',
            'commentable_id' => 'required|integer'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $comments = Comment::where('commentable_type', $request->commentable_type)
            ->where('commentable_id', $request->commentable_id)
            ->whereNull('parent_id')
            ->with(['replies' => function ($query) {
                $query->orderBy('created_at', 'asc');
            }])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($comments);
    }

    public function like(Request $request, $commentId)
    {
        $comment = Comment::findOrFail($commentId);
        
        $existingLike = CommentLike::where('comment_id', $commentId)
            ->where('user_id', $request->user_id)
            ->first();

        if ($existingLike) {
            $existingLike->delete();
            $comment->decrement('likes_count');
            $liked = false;
        } else {
            CommentLike::create([
                'comment_id' => $commentId,
                'user_id' => $request->user_id
            ]);
            $comment->increment('likes_count');
            $liked = true;
        }

        return response()->json([
            'liked' => $liked,
            'likes_count' => $comment->fresh()->likes_count
        ]);
    }

    public function update(Request $request, $id)
    {
        $comment = Comment::findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'content' => 'required|string|max:1000'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $comment->update(['content' => $request->content]);

        return response()->json($comment);
    }

    public function destroy($id)
    {
        $comment = Comment::findOrFail($id);
        
        // Update parent replies count if this is a reply
        if ($comment->parent_id) {
            Comment::where('id', $comment->parent_id)->decrement('replies_count');
        }
        
        $comment->delete();

        return response()->json(['message' => 'Comment deleted successfully']);
    }
}
