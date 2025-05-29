"use client"

import type React from "react"
import { useState } from "react"
import { X } from 'lucide-react'

interface CreatePostModalProps {
  onClose: () => void
  onSubmit: (data: any) => void
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    type: "review",
    content: "",
    song_title: "",
    artist: "",
    album: "",
    is_public: true,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Share Your Music</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Post Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="review">Music Review</option>
              <option value="timeline">Timeline Entry</option>
              <option value="playlist">Playlist Share</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Song Title</label>
            <input
              type="text"
              name="song_title"
              value={formData.song_title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="What song are you sharing?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Artist</label>
            <input
              type="text"
              name="artist"
              value={formData.artist}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Artist name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Album (Optional)</label>
            <input
              type="text"
              name="album"
              value={formData.album}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Album name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Thoughts</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Share your thoughts about this music..."
              required
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="is_public"
              id="is_public"
              checked={formData.is_public}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="is_public" className="ml-2 block text-sm text-gray-900">
              Share publicly
            </label>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Share
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreatePostModal
