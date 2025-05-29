"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { profileAPI } from "../services/api"
import { Plus, Music, Calendar, MapPin, Star } from "lucide-react"
import LoadingSpinner from "../components/UI/LoadingSpinner"
import AddTimelineModal from "../components/Timeline/AddTimelineModal"

interface TimelineEntry {
  id: number
  title: string
  description: string
  song_title: string
  artist: string
  album: string
  listened_at: string
  location: string
  mood: string
  rating: number
  cover_image: string
}

const Timeline: React.FC = () => {
  const { user } = useAuth()
  const [entries, setEntries] = useState<TimelineEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    fetchTimeline()
  }, [])

  const fetchTimeline = async () => {
    try {
      const response = await profileAPI.getTimeline()
      setEntries(response.data.data || [])
    } catch (error) {
      console.error("Error fetching timeline:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddEntry = async (data: any) => {
    try {
      await profileAPI.addTimelineEntry(data)
      fetchTimeline()
      setShowAddModal(false)
    } catch (error) {
      console.error("Error adding timeline entry:", error)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">My Music Timeline</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Entry</span>
        </button>
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-12">
          <Music className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No timeline entries yet</h3>
          <p className="text-gray-600 mb-4">Start documenting your music journey!</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Your First Entry
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {entries.map((entry) => (
            <div key={entry.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-start space-x-4">
                {entry.cover_image && (
                  <img
                    src={entry.cover_image || "/placeholder.svg"}
                    alt={entry.album}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{entry.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center space-x-1">
                      <Music className="h-4 w-4" />
                      <span>
                        {entry.song_title} - {entry.artist}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(entry.listened_at).toLocaleDateString()}</span>
                    </div>
                    {entry.location && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{entry.location}</span>
                      </div>
                    )}
                  </div>
                  {entry.description && <p className="text-gray-700 mb-3">{entry.description}</p>}
                  <div className="flex items-center justify-between">
                    {entry.mood && (
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {entry.mood}
                      </span>
                    )}
                    {entry.rating && (
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < entry.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddModal && <AddTimelineModal onClose={() => setShowAddModal(false)} onSubmit={handleAddEntry} />}
    </div>
  )
}

export default Timeline
