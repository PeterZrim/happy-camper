import axios from 'axios'

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT),
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If error is 401 and we haven't tried to refresh token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refresh_token')
        if (!refreshToken) {
          throw new Error('No refresh token')
        }

        // Try to refresh token
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/token/refresh/`, {
          refresh: refreshToken
        })

        const { access } = response.data
        localStorage.setItem('token', access)

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${access}`
        return api(originalRequest)
      } catch (error) {
        // If refresh fails, logout user
        localStorage.removeItem('token')
        localStorage.removeItem('refresh_token')
        window.location.href = '/login'
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  async login(credentials) {
    const response = await api.post('/api/auth/token/', credentials)
    const { access, refresh, user } = response.data
    localStorage.setItem('token', access)
    localStorage.setItem('refresh_token', refresh)
    return user
  },

  async register(userData) {
    const response = await api.post('/api/auth/register/', userData)
    const { tokens, user } = response.data
    localStorage.setItem('token', tokens.access)
    localStorage.setItem('refresh_token', tokens.refresh)
    return user
  },

  async logout() {
    try {
      // Get the refresh token from local storage
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token found');
      }

      // Send logout request with both tokens
      const response = await api.post('/api/auth/logout/', {
        refresh: refreshToken
      });

      // Clear tokens from local storage
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      
      // Reset axios default authorization header
      api.defaults.headers.common['Authorization'] = '';
      
      return response.data;
    } catch (error) {
      // Even if the server request fails, clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      api.defaults.headers.common['Authorization'] = '';
      
      throw error;
    }
  },

  async getProfile() {
    const response = await api.get('/api/auth/profile/')
    return response.data
  },

  async updateProfile(userData) {
    const response = await api.patch('/api/auth/profile/', userData)
    return response.data
  }
}

// User API
export const userAPI = {
  getProfile: () => api.get('/users/profile/'),
  updateProfile: (data) => api.patch('/users/profile/', data),
  changePassword: (data) => api.post('/users/change-password/', data),
}

// Campsite API
export const campsiteAPI = {
  getCampsites: (params) => api.get('/api/campsites/', { params }),
  getFeaturedCampsites: () => api.get('/api/campsites/featured/'),
  getCampsite: (id) => api.get(`/api/campsites/${id}/`),
  createCampsite: (data) => api.post('/api/campsites/', data),
  updateCampsite: (id, data) => api.put(`/api/campsites/${id}/`, data),
  deleteCampsite: (id) => api.delete(`/api/campsites/${id}/`),
  uploadImage: (id, formData) => api.post(`/api/campsites/${id}/upload_image/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  addReview: (id, data) => api.post(`/api/campsites/${id}/review/`, data),
  getReviews: (id) => api.get(`/api/campsites/${id}/reviews/`),
}

// Booking API
export const bookingAPI = {
  getBookings: () => api.get('/bookings/'),
  createBooking: (data) => api.post('/bookings/', data),
  updateBooking: (id, data) => api.patch(`/bookings/${id}/`, data),
  cancelBooking: (id) => api.patch(`/bookings/${id}/`, { status: 'cancelled' }),
}

// Review API
export const reviewAPI = {
  getReviews: (campsiteId) => api.get(`/campsites/${campsiteId}/reviews/`),
  createReview: (data) => api.post('/reviews/', data),
  updateReview: (id, data) => api.patch(`/reviews/${id}/`, data),
  deleteReview: (id) => api.delete(`/reviews/${id}/`),
}

// Admin API
export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard/stats/'),
  getPendingBookings: () => api.get('/admin/bookings/pending/'),
  getRevenueStats: (params) => api.get('/admin/stats/revenue/', { params }),
  getOccupancyStats: (params) => api.get('/admin/stats/occupancy/', { params }),
}

// Settings API
export const settingsAPI = {
  getSettings: () => api.get('/api/settings/'),
  updateSettings: (data) => api.put('/api/settings/', data),
}

// Export the api instance for other services to use
export default api
