import React, { createContext, useContext, useState, useEffect } from 'react'
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
    try {
      const response = await authAPI.login(credentials)
      setUser(response.data.user)
      localStorage.setItem('token', response.data.token)
      navigate('/')
      return true
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
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

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData)
      setUser(response.data.user)
      localStorage.setItem('token', response.data.token)
      navigate('/')
      return true
    } catch (error) {
      console.error('Registration error:', error)
      return false
    }
  }

  const value = {
    user,
    loading,
    login,
    logout,
    register,
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
