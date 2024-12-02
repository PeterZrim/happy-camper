import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import theme from './theme'
import { AuthProvider } from './contexts/AuthContext'

// Components
import Navbar from './components/common/Navbar'
import ProtectedRoute from './components/common/ProtectedRoute'

// Pages
import Home from './components/pages/Home'
import Login from './components/pages/Login'
import Signup from './components/pages/Signup'
import Campsites from './components/pages/Campsites'
import Bookings from './components/pages/Bookings'
import Reviews from './components/pages/Reviews'
import Dashboard from './components/pages/Dashboard'

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CssBaseline />
        <AuthProvider>
          <div className="app">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/campsites" element={<Campsites />} />
                <Route 
                  path="/bookings" 
                  element={
                    <ProtectedRoute>
                      <Bookings />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/reviews" 
                  element={
                    <ProtectedRoute>
                      <Reviews />
                    </ProtectedRoute>
                  } 
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
          </div>
        </AuthProvider>
      </LocalizationProvider>
    </ThemeProvider>
  )
}

export default App
