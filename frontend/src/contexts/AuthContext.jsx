import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI, userAPI } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const response = await userAPI.getProfile()
          setUser(response.data)
        } catch (error) {
          localStorage.removeItem('token')
        }
      }
      setLoading(false)
    }

    initializeAuth()
  }, [])

  const login = async (credentials) => {
    const response = await authAPI.login(credentials)
    localStorage.setItem('token', response.data.token)
    const userResponse = await userAPI.getProfile()
    setUser(userResponse.data)
    return response
  }

  const register = async (userData) => {
    const response = await authAPI.register(userData)
    localStorage.setItem('token', response.data.token)
    const userResponse = await userAPI.getProfile()
    setUser(userResponse.data)
    return response
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('token')
      setUser(null)
      navigate('/login')
    }
  }

  const updateProfile = async (data) => {
    const response = await userAPI.updateProfile(data)
    setUser(response.data)
    return response
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
