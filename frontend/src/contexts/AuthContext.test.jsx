import { render, screen, act, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider, useAuth } from './AuthContext'
import { authAPI, userAPI } from '../services/api'

// Mock the API modules
vi.mock('../services/api', () => ({
  authAPI: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  },
  userAPI: {
    getProfile: vi.fn(),
    updateProfile: vi.fn(),
  },
}))

// Test component that uses the auth context
const TestComponent = () => {
  const { user, login, logout, register, isAuthenticated } = useAuth()
  return (
    <div>
      <div data-testid="auth-status">{isAuthenticated ? 'logged-in' : 'logged-out'}</div>
      <div data-testid="user-email">{user?.email}</div>
      <button onClick={() => login({ email: 'test@example.com', password: 'password' })}>
        Login
      </button>
      <button onClick={logout}>Logout</button>
      <button
        onClick={() =>
          register({
            email: 'new@example.com',
            password: 'password',
            firstName: 'Test',
            lastName: 'User',
          })
        }
      >
        Register
      </button>
    </div>
  )
}

const renderWithAuth = (component) => {
  return render(<BrowserRouter><AuthProvider>{component}</AuthProvider></BrowserRouter>)
}

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('provides authentication status', () => {
    renderWithAuth(<TestComponent />)
    expect(screen.getByTestId('auth-status')).toHaveTextContent('logged-out')
  })

  it('handles successful login', async () => {
    const mockUser = { email: 'test@example.com', id: 1 }
    authAPI.login.mockResolvedValueOnce({ data: { token: 'fake-token' } })
    userAPI.getProfile.mockResolvedValueOnce({ data: mockUser })

    renderWithAuth(<TestComponent />)
    
    await act(async () => {
      await userEvent.click(screen.getByText('Login'))
    })

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('logged-in')
      expect(screen.getByTestId('user-email')).toHaveTextContent(mockUser.email)
    })
  })

  it('handles successful registration', async () => {
    const mockUser = { email: 'new@example.com', id: 2 }
    authAPI.register.mockResolvedValueOnce({ data: { token: 'fake-token' } })
    userAPI.getProfile.mockResolvedValueOnce({ data: mockUser })

    renderWithAuth(<TestComponent />)
    
    await act(async () => {
      await userEvent.click(screen.getByText('Register'))
    })

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('logged-in')
      expect(screen.getByTestId('user-email')).toHaveTextContent(mockUser.email)
    })
  })

  it('handles logout', async () => {
    const mockUser = { email: 'test@example.com', id: 1 }
    authAPI.login.mockResolvedValueOnce({ data: { token: 'fake-token' } })
    userAPI.getProfile.mockResolvedValueOnce({ data: mockUser })

    renderWithAuth(<TestComponent />)
    
    // Login first
    await act(async () => {
      await userEvent.click(screen.getByText('Login'))
    })

    // Then logout
    await act(async () => {
      await userEvent.click(screen.getByText('Logout'))
    })

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('logged-out')
      expect(screen.getByTestId('user-email')).toBeEmpty()
    })
  })
})
