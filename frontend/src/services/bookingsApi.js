import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const bookingsApi = {
  // Get all bookings (with optional filters)
  getBookings: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.startDate) params.append('check_in_date', filters.startDate);
    if (filters.endDate) params.append('check_out_date', filters.endDate);
    if (filters.status) params.append('status', filters.status);
    
    try {
      const response = await axios.get(`${API_URL}/bookings/`, {
        params,
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get a single booking by ID
  getBooking: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/bookings/${id}/`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create a new booking
  createBooking: async (bookingData) => {
    try {
      const response = await axios.post(`${API_URL}/bookings/`, bookingData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update a booking
  updateBooking: async (id, bookingData) => {
    try {
      const response = await axios.put(`${API_URL}/bookings/${id}/`, bookingData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Cancel a booking
  cancelBooking: async (id) => {
    try {
      const response = await axios.post(`${API_URL}/bookings/${id}/cancel/`, {}, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete a booking
  deleteBooking: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/bookings/${id}/`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default bookingsApi;
