import axios from "axios"

const API_BASE_URL = "/api"

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false, // Disable credentials for API-only authentication
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

// Auth API
export const authAPI = {
  login: (data: { email: string; password: string }) => api.post("/auth/login", data),
  register: (data: { name: string; email: string; password: string; username: string }) =>
    api.post("/auth/register", data),
  me: () => api.get("/auth/me"),
  logout: () => api.post("/auth/logout"),
}

// Profile API
export const profileAPI = {
  getProfile: () => api.get("/profile/me"),
  updateProfile: (data: any) => api.put("/profile/me", data),
  getTimeline: () => api.get("/profile/timeline"),
  addTimelineEntry: (data: any) => api.post("/profile/timeline", data),
}

// Playlist API
export const playlistAPI = {
  getPlaylists: () => api.get("/playlist"),
  createPlaylist: (data: any) => api.post("/playlist", data),
  getPlaylist: (id: number) => api.get(`/playlist/${id}`),
  updatePlaylist: (id: number, data: any) => api.put(`/playlist/${id}`, data),
  deletePlaylist: (id: number) => api.delete(`/playlist/${id}`),
  addSong: (playlistId: number, data: any) => api.post(`/playlist/${playlistId}/songs`, data),
  removeSong: (playlistId: number, songId: number) => api.delete(`/playlist/${playlistId}/songs/${songId}`),
}

// Social API
export const socialAPI = {
  getFeed: () => api.get("/social/feed"),
  createPost: (data: any) => api.post("/social/posts", data),
  likePost: (postId: number) => api.post(`/social/posts/${postId}/like`),
  commentPost: (postId: number, data: any) => api.post(`/social/posts/${postId}/comment`, data),
  getComments: (postId: number) => api.get(`/social/posts/${postId}/comments`),
}

// Media API
export const mediaAPI = {
  upload: (formData: FormData) =>
    api.post("/media/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getUserMedia: () => api.get("/media/user"),
  deleteMedia: (id: number) => api.delete(`/media/${id}`),
}

// Analytics API
export const analyticsAPI = {
  trackActivity: (data: any) => api.post("/analytics/activity", data),
  getUserStats: (userId: number) => api.get(`/analytics/users/${userId}/stats`),
}

export default api
