import axios from 'axios'

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Function to get CSRF token from cookies
function getCsrfToken() {
  const name = 'csrftoken='
  const decodedCookie = decodeURIComponent(document.cookie)
  const cookieArray = decodedCookie.split(';')
  
  for (let cookie of cookieArray) {
    cookie = cookie.trim()
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length)
    }
  }
  return null
}

// Add request interceptor to add auth token and CSRF token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    // Only add CSRF token for non-GET requests
    if (config.method !== 'get') {
      const csrfToken = getCsrfToken()
      if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle specific error cases
      switch (error.response.status) {
        case 403:
          if (error.response.data.detail === 'CSRF Failed: CSRF token missing or incorrect') {
            // Refresh the page to get a new CSRF token
            window.location.reload()
            return
          }
          break
        case 401:
          // Handle unauthorized access
          localStorage.removeItem('token')
          window.location.href = '/login'
          break
        default:
          break
      }
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login/', credentials),
  register: (userData) => api.post('/auth/register/', userData),
  logout: () => api.post('/auth/logout/'),
  refreshToken: () => api.post('/auth/token/refresh/'),
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

export default api
