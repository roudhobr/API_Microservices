"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { playlistAPI } from "../services/api"
import { Plus, Music, Clock, Globe, Lock, Edit, Trash2 } from 'lucide-react'
import LoadingSpinner from "../components/UI/LoadingSpinner"
import CreatePlaylistModal from "../components/Playlists/CreatePlaylistModal"

interface Playlist {
  id: number
  title: string
  description: string
  cover_image: string
  is_public: boolean
  total_duration: number
  total_songs: number
  created_at: string
}

const Playlists: React.FC = () => {
  const { user } = useAuth()
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    fetchPlaylists()
  }, [])

  const fetchPlaylists = async () => {
    try {
      const response = await playlistAPI.getPlaylists()
      setPlaylists(response.data.data || [])
    } catch (error) {
      console.error("Error fetching playlists:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePlaylist = async (data: any) => {
    try {
      await playlistAPI.createPlaylist({
        ...data,
        user_id: user?.id,
      })
      fetchPlaylists()
      setShowCreateModal(false)
    } catch (error) {
      console.error("Error creating playlist:", error)
    }
  }

  const handleDeletePlaylist = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this playlist?")) {
      try {
        await playlistAPI.deletePlaylist(id)
        fetchPlaylists()
      } catch (error) {
        console.error("Error deleting playlist:", error)
      }
    }
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">My Playlists</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Create Playlist</span>
        </button>
      </div>

      {playlists.length === 0 ? (
        <div className="text-center py-12">
          <Music className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No playlists yet</h3>
          <p className="text-gray-600 mb-4">Create your first playlist to organize your favorite songs!</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Your First Playlist
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {playlists.map((playlist) => (
            <div key={playlist.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-blue-400 to-purple-500">
                {playlist.cover_image ? (
                  <img
                    src={playlist.cover_image || "/placeholder.svg"}
                    alt={playlist.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 flex items-center justify-center">
                    <Music className="h-16 w-16 text-white opacity-80" />
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">{playlist.title}</h3>
                  <div className="flex items-center space-x-1 ml-2">
                    {playlist.is_public ? (
                      <div title="Public playlist">
                        <Globe className="h-4 w-4 text-green-500" />
                      </div>
                    ) : (
                      <div title="Private playlist">
                        <Lock className="h-4 w-4 text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>
                
                {playlist.description && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{playlist.description}</p>
                )}
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center space-x-1">
                      <Music className="h-4 w-4" />
                      <span>{playlist.total_songs} songs</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{formatDuration(playlist.total_duration)}</span>
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    Created {new Date(playlist.created_at).toLocaleDateString()}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Edit playlist"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeletePlaylist(playlist.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete playlist"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreatePlaylistModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreatePlaylist}
        />
      )}
    </div>
  )
}

export default Playlists
