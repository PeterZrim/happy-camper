import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import { BrowserRouter, useLocation } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import { useAuth } from '../../contexts/AuthContext'

// Mock the auth context
vi.mock('../../contexts/AuthContext')

// Mock the useLocation hook
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useLocation: vi.fn(),
  }
})

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    useLocation.mockReturnValue({ pathname: '/protected' })
  })

  it('shows loading state when authentication is loading', () => {
    useAuth.mockReturnValue({
      loading: true,
      isAuthenticated: false,
      user: null,
    })

    renderWithRouter(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    )

    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('redirects to login when user is not authenticated', () => {
    useAuth.mockReturnValue({
      loading: false,
      isAuthenticated: false,
      user: null,
    })

    renderWithRouter(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    )

    expect(window.location.pathname).toBe('/login')
  })

  it('renders children when user is authenticated', () => {
    useAuth.mockReturnValue({
      loading: false,
      isAuthenticated: true,
      user: { id: 1, email: 'test@example.com' },
    })

    renderWithRouter(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    )

    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('redirects non-owner users from owner-only routes', () => {
    useAuth.mockReturnValue({
      loading: false,
      isAuthenticated: true,
      user: { id: 1, email: 'test@example.com', is_owner: false },
    })

    renderWithRouter(
      <ProtectedRoute requireOwner>
        <div>Owner Only Content</div>
      </ProtectedRoute>
    )

    expect(window.location.pathname).toBe('/')
  })

  it('allows owner users to access owner-only routes', () => {
    useAuth.mockReturnValue({
      loading: false,
      isAuthenticated: true,
      user: { id: 1, email: 'test@example.com', is_owner: true },
    })

    renderWithRouter(
      <ProtectedRoute requireOwner>
        <div>Owner Only Content</div>
      </ProtectedRoute>
    )

    expect(screen.getByText('Owner Only Content')).toBeInTheDocument()
  })
})
