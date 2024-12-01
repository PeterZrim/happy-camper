import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Box, CircularProgress } from '@mui/material'

function ProtectedRoute({ children, requireOwner = false }) {
  const { user, loading, isAuthenticated } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requireOwner && !user?.is_owner) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
