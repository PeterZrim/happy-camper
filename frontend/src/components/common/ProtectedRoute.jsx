import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading, checkPermission } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && !checkPermission(requiredRole)) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
