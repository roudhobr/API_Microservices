"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { authAPI } from "../services/api"
import toast from "react-hot-toast"

interface User {
  id: number
  name: string
  email: string
  username: string
  bio?: string
  avatar?: string
  birth_date?: string
  favorite_genres?: string[]
  listening_since?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<boolean>
  register: (data: RegisterData) => Promise<boolean>
  logout: () => void
  loading: boolean
}

interface RegisterData {
  name: string
  email: string
  password: string
  username: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [token])

  const fetchUser = async () => {
    try {
      const response = await authAPI.me()
      setUser(response.data)
    } catch (error) {
      localStorage.removeItem("token")
      setToken(null)
      toast.error("Session expired. Please login again.")
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authAPI.login({ email, password })
      const { user: userData, token: userToken } = response.data

      setUser(userData)
      setToken(userToken)
      localStorage.setItem("token", userToken)

      toast.success("Login successful!")
      return true
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed")
      return false
    }
  }

  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      const response = await authAPI.register(data)
      const { user: userData, token: userToken } = response.data

      setUser(userData)
      setToken(userToken)
      localStorage.setItem("token", userToken)

      toast.success("Registration successful!")
      return true
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed")
      return false
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("token")
    toast.success("Logged out successfully")
  }

  const value = {
    user,
    token,
    login,
    register,
    logout,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
