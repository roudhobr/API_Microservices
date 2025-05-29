"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { socialAPI } from "../services/api"
import { Heart, MessageCircle, Share2, Music, Plus } from 'lucide-react'
import LoadingSpinner from "../components/UI/LoadingSpinner"
import CreatePostModal from "../components/Social/CreatePostModal"

interface Post {
  id: number
  user_id: number
  type: string
  content: string
  song_title?: string
  artist?: string
  album?: string
  likes_count: number
  comments_count: number
  shares_count: number
  created_at: string
}

const Social: React.FC = () => {
  const { user } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    fetchFeed()
  }, [])

  const fetchFeed = async () => {
    try {
      const response = await socialAPI.getFeed()
      setPosts(response.data.data || [])
    } catch (error) {
      console.error("Error fetching feed:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePost = async (data: any) => {
    try {
      await socialAPI.createPost({
        ...data,
        user_id: user?.id,
      })
      fetchFeed()
      setShowCreateModal(false)
    } catch (error) {
      console.error("Error creating post:", error)
    }
  }

  const handleLikePost = async (postId: number) => {
    try {
      await socialAPI.likePost(postId)
      // Update the post in the local state
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, likes_count: post.likes_count + 1 }
          : post
      ))
    } catch (error) {
      console.error("Error liking post:", error)
    }
  }

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case "timeline":
        return "📅"
      case "playlist":
        return "🎵"
      case "review":
        return "⭐"
      default:
        return "💭"
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Social Feed</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Share</span>
        </button>
      </div>

      {/* Create Post Card */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <button
          onClick={() => setShowCreateModal(true)}
          className="w-full text-left p-3 bg-gray-50 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
        >
          What music are you discovering today?
        </button>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <Music className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
          <p className="text-gray-600 mb-4">Be the first to share your musical discoveries!</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Your First Post
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-medium text-gray-900">{user?.name || "Anonymous"}</span>
                    <span className="text-sm text-gray-500">
                      {getPostTypeIcon(post.type)} {post.type}
                    </span>
                    <span className="text-sm text-gray-400">
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {post.song_title && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-3">
                      <div className="flex items-center space-x-2">
                        <Music className="h-4 w-4 text-blue-600" />
                        <div>
                          <p className="font-medium text-gray-900">{post.song_title}</p>
                          <p className="text-sm text-gray-600">
                            by {post.artist} {post.album && `• ${post.album}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <p className="text-gray-700 mb-4">{post.content}</p>
                  
                  <div className="flex items-center space-x-6 text-gray-500">
                    <button
                      onClick={() => handleLikePost(post.id)}
                      className="flex items-center space-x-2 hover:text-red-500 transition-colors"
                    >
                      <Heart className="h-4 w-4" />
                      <span>{post.likes_count}</span>
                    </button>
                    
                    <button className="flex items-center space-x-2 hover:text-blue-500 transition-colors">
                      <MessageCircle className="h-4 w-4" />
                      <span>{post.comments_count}</span>
                    </button>
                    
                    <button className="flex items-center space-x-2 hover:text-green-500 transition-colors">
                      <Share2 className="h-4 w-4" />
                      <span>{post.shares_count}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreatePostModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreatePost}
        />
      )}
    </div>
  )
}

export default Social
