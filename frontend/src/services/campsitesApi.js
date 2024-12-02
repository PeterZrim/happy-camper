import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const campsitesApi = {
  // Get all campsites (with optional filters)
  getCampsites: async (filters = {}) => {
    try {
      const response = await axios.get(`${API_URL}/campsites/`, {
        params: filters,
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get campsites owned by the current user
  getMyCampsites: async () => {
    try {
      const response = await axios.get(`${API_URL}/campsites/my-campsites/`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get a single campsite by ID
  getCampsite: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/campsites/${id}/`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create a new campsite
  createCampsite: async (campsiteData) => {
    try {
      const formData = new FormData();
      // Handle file uploads if present
      if (campsiteData.images) {
        campsiteData.images.forEach((image) => {
          formData.append('images', image);
        });
        delete campsiteData.images;
      }
      // Add other campsite data
      Object.keys(campsiteData).forEach(key => {
        formData.append(key, campsiteData[key]);
      });

      const response = await axios.post(`${API_URL}/campsites/`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update a campsite
  updateCampsite: async (id, campsiteData) => {
    try {
      const formData = new FormData();
      // Handle file uploads if present
      if (campsiteData.images) {
        campsiteData.images.forEach((image) => {
          formData.append('images', image);
        });
        delete campsiteData.images;
      }
      // Add other campsite data
      Object.keys(campsiteData).forEach(key => {
        formData.append(key, campsiteData[key]);
      });

      const response = await axios.put(`${API_URL}/campsites/${id}/`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete a campsite
  deleteCampsite: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/campsites/${id}/`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Upload campsite images
  uploadImages: async (id, images) => {
    try {
      const formData = new FormData();
      images.forEach((image) => {
        formData.append('images', image);
      });

      const response = await axios.post(`${API_URL}/campsites/${id}/images/`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete a campsite image
  deleteImage: async (campsiteId, imageId) => {
    try {
      const response = await axios.delete(`${API_URL}/campsites/${campsiteId}/images/${imageId}/`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Search campsites
  searchCampsites: async (query) => {
    try {
      const response = await axios.get(`${API_URL}/campsites/search/`, {
        params: { q: query },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default campsitesApi;
