"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { analyticsAPI, profileAPI, playlistAPI } from "../services/api"
import { Music, Users, Clock, TrendingUp } from "lucide-react"
import LoadingSpinner from "../components/UI/LoadingSpinner"

interface DashboardStats {
  totalPlaylists: number
  totalTimelineEntries: number
  totalListeningTime: number
  topGenres: Array<{ genre: string; count: number }>
}

const Dashboard: React.FC = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [analyticsResponse, timelineResponse, playlistsResponse] = await Promise.all([
        analyticsAPI.getUserStats(user!.id),
        profileAPI.getTimeline(),
        playlistAPI.getPlaylists(),
      ])

      setStats({
        totalPlaylists: playlistsResponse.data.total || 0,
        totalTimelineEntries: timelineResponse.data.total || 0,
        totalListeningTime:
          analyticsResponse.data.listening_stats?.reduce((acc: number, stat: any) => acc + stat.total_duration, 0) || 0,
        topGenres: analyticsResponse.data.top_genres || [],
      })
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <Music className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Playlists</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalPlaylists}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Timeline Entries</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalTimelineEntries}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Listening Time</p>
              <p className="text-2xl font-bold text-gray-900">{Math.round((stats?.totalListeningTime || 0) / 60)}m</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Top Genres</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.topGenres.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Genres</h2>
          <div className="space-y-3">
            {stats?.topGenres.map((genre, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-700">{genre.genre}</span>
                <span className="text-sm text-gray-500">{genre.count} plays</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              Add Timeline Entry
            </button>
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              Create New Playlist
            </button>
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              Share Music Story
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
