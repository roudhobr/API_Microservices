"use client"

// import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { analyticsAPI } from "../services/api"
import { BarChart3, TrendingUp, Music, Clock, Calendar } from 'lucide-react'
import LoadingSpinner from "../components/UI/LoadingSpinner"

interface AnalyticsData {
  total_activities: number
  listening_stats: Array<{
    song_title: string
    artist: string
    listen_count: number
    total_duration: number
  }>
  activity_breakdown: Array<{
    activity_type: string
    count: number
  }>
  top_genres: Array<{
    genre: string
    total_listens: number
  }>
  listening_trends: Array<{
    date: string
    listens: number
  }>
}

const Analytics: React.FC = () => {
  const { user } = useAuth()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("30d")

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      const response = await analyticsAPI.getUserStats(user!.id)
      setAnalytics(response.data)
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setLoading(false)
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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "listen":
        return <Music className="h-4 w-4" />
      case "like":
        return "❤️"
      case "share":
        return "📤"
      case "comment":
        return "💬"
      case "create_playlist":
        return "🎵"
      default:
        return <BarChart3 className="h-4 w-4" />
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Music Analytics</h1>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 3 months</option>
          <option value="1y">Last year</option>
        </select>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Activities</p>
              <p className="text-2xl font-bold text-gray-900">{analytics?.total_activities || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <Music className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Songs Tracked</p>
              <p className="text-2xl font-bold text-gray-900">{analytics?.listening_stats?.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Listening Time</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatDuration(
                  analytics?.listening_stats?.reduce((acc, stat) => acc + stat.total_duration, 0) || 0
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Top Genres</p>
              <p className="text-2xl font-bold text-gray-900">{analytics?.top_genres?.length || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Songs */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Most Played Songs</h2>
          {analytics?.listening_stats && analytics.listening_stats.length > 0 ? (
            <div className="space-y-3">
              {analytics.listening_stats.slice(0, 5).map((song, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{song.song_title}</p>
                    <p className="text-sm text-gray-600">{song.artist}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{song.listen_count} plays</p>
                    <p className="text-xs text-gray-500">{formatDuration(song.total_duration)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Music className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No listening data yet</p>
              <p className="text-sm text-gray-500">Start tracking your music to see analytics here.</p>
            </div>
          )}
        </div>

        {/* Activity Breakdown */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Activity Breakdown</h2>
          {analytics?.activity_breakdown && analytics.activity_breakdown.length > 0 ? (
            <div className="space-y-3">
              {analytics.activity_breakdown.map((activity, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getActivityIcon(activity.activity_type)}
                    <span className="capitalize text-gray-700">{activity.activity_type.replace('_', ' ')}</span>
                  </div>
                  <span className="font-medium text-gray-900">{activity.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No activity data yet</p>
            </div>
          )}
        </div>

        {/* Top Genres */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Favorite Genres</h2>
          {analytics?.top_genres && analytics.top_genres.length > 0 ? (
            <div className="space-y-3">
              {analytics.top_genres.map((genre, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-700">{genre.genre}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${Math.min(
                            (genre.total_listens / Math.max(...analytics.top_genres.map(g => g.total_listens))) * 100,
                            100
                          )}%`
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{genre.total_listens}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Music className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No genre data yet</p>
            </div>
          )}
        </div>

        {/* Listening Trends */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Listening Trends</h2>
          {analytics?.listening_trends && analytics.listening_trends.length > 0 ? (
            <div className="space-y-2">
              {analytics.listening_trends.slice(0, 7).map((trend, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {new Date(trend.date).toLocaleDateString()}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-1">
                      <div
                        className="bg-green-600 h-1 rounded-full"
                        style={{
                          width: `${Math.min(
                            (trend.listens / Math.max(...analytics.listening_trends.map(t => t.listens))) * 100,
                            100
                          )}%`
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{trend.listens}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No trend data yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Insights */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">Most Active Day</h3>
            <p className="text-sm text-blue-700">
              {analytics?.listening_trends && analytics.listening_trends.length > 0
                ? new Date(
                    analytics.listening_trends.reduce((max, trend) =>
                      trend.listens > max.listens ? trend : max
                    ).date
                  ).toLocaleDateString()
                : "No data yet"}
            </p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-medium text-green-900 mb-2">Discovery Rate</h3>
            <p className="text-sm text-green-700">
              {analytics?.listening_stats ? `${analytics.listening_stats.length} unique songs` : "No data yet"}
            </p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-medium text-purple-900 mb-2">Average Session</h3>
            <p className="text-sm text-purple-700">
              {analytics?.listening_stats && analytics.listening_stats.length > 0
                ? formatDuration(
                    analytics.listening_stats.reduce((acc, stat) => acc + stat.total_duration, 0) /
                    analytics.listening_stats.length
                  )
                : "No data yet"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics
