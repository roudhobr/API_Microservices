"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { profileAPI } from "../services/api"
import { User, Edit, Camera, Music, Calendar } from 'lucide-react'
import LoadingSpinner from "../components/UI/LoadingSpinner"

const Profile: React.FC = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState(user)
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    bio: "",
    favorite_genres: [] as string[],
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await profileAPI.getProfile()
      setProfile(response.data)
      setFormData({
        name: response.data.name || "",
        bio: response.data.bio || "",
        favorite_genres: Array.isArray(response.data.favorite_genres) ? response.data.favorite_genres : [],
      })
    } catch (error) {
      console.error("Error fetching profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      const response = await profileAPI.updateProfile(formData)
      setProfile(response.data)
      setEditing(false)
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleGenreChange = (genre: string) => {
    const genres = formData.favorite_genres.includes(genre)
      ? formData.favorite_genres.filter(g => g !== genre)
      : [...formData.favorite_genres, genre]
    
    setFormData({
      ...formData,
      favorite_genres: genres,
    })
  }

  const availableGenres = [
    "Rock", "Pop", "Hip Hop", "Jazz", "Classical", "Electronic", 
    "Country", "R&B", "Indie", "Alternative", "Folk", "Blues"
  ]

  if (loading && !profile) {
    return <LoadingSpinner />
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Cover Photo */}
        <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>
        
        {/* Profile Info */}
        <div className="px-6 py-4">
          <div className="flex items-start space-x-4 -mt-16">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                {profile?.avatar ? (
                  <img
                    src={profile.avatar || "/placeholder.svg"}
                    alt={profile.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="h-12 w-12 text-gray-400" />
                )}
              </div>
              <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full hover:bg-blue-700 transition-colors">
                <Camera className="h-3 w-3" />
              </button>
            </div>
            
            {/* Profile Details */}
            <div className="flex-1 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  {editing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="text-2xl font-bold text-gray-900 border-b border-gray-300 focus:border-blue-500 outline-none"
                    />
                  ) : (
                    <h1 className="text-2xl font-bold text-gray-900">{profile?.name}</h1>
                  )}
                  <p className="text-gray-600">@{profile?.username}</p>
                </div>
                
                <div className="flex space-x-2">
                  {editing ? (
                    <>
                      <button
                        onClick={() => setEditing(false)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        {loading ? "Saving..." : "Save"}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setEditing(true)}
                      className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Edit Profile</span>
                    </button>
                  )}
                </div>
              </div>
              
              {/* Bio */}
              <div className="mt-4">
                {editing ? (
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tell us about your musical journey..."
                  />
                ) : (
                  <p className="text-gray-700">
                    {profile?.bio || "No bio yet. Share your musical story!"}
                  </p>
                )}
              </div>
              
              {/* Favorite Genres */}
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Favorite Genres</h3>
                {editing ? (
                  <div className="flex flex-wrap gap-2">
                    {availableGenres.map((genre) => (
                      <button
                        key={genre}
                        onClick={() => handleGenreChange(genre)}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          formData.favorite_genres.includes(genre)
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(profile?.favorite_genres) ? profile.favorite_genres : []).map((genre: string) => (
                      <span
                        key={genre}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {genre}
                      </span>
                    ))}
                    {(!Array.isArray(profile?.favorite_genres) || profile.favorite_genres.length === 0) && (
                      <span className="text-gray-500 text-sm">No favorite genres selected</span>
                    )}
                  </div>
                )}
              </div>
              
              {/* Stats */}
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">0</div>
                  <div className="text-sm text-gray-600">Playlists</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">0</div>
                  <div className="text-sm text-gray-600">Timeline Entries</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">0</div>
                  <div className="text-sm text-gray-600">Following</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="text-center py-8">
          <Music className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No recent activity</p>
          <p className="text-sm text-gray-500 mt-2">
            Start adding timeline entries or creating playlists to see your activity here.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Profile
