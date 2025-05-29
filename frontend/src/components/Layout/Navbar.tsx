"use client"

import type React from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { Music, User, LogOut, BarChart3, Users, List, Clock } from "lucide-react"

const Navbar: React.FC = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Music className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-800">TuneTrail</span>
          </Link>

          {/* Navigation Links */}
          {user && (
            <div className="hidden md:flex items-center space-x-6">
              <Link
                to="/dashboard"
                className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <BarChart3 className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              <Link
                to="/timeline"
                className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Clock className="h-4 w-4" />
                <span>Timeline</span>
              </Link>
              <Link
                to="/playlists"
                className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <List className="h-4 w-4" />
                <span>Playlists</span>
              </Link>
              <Link
                to="/social"
                className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Users className="h-4 w-4" />
                <span>Social</span>
              </Link>
              <Link
                to="/analytics"
                className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <BarChart3 className="h-4 w-4" />
                <span>Analytics</span>
              </Link>
            </div>
          )}

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden md:block">{user.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden md:block">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
