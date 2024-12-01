import api from './api'

const settingsAPI = {
  getSettings: () => api.get('/api/settings/'),
  
  updateSettings: (settings) => api.put('/api/settings/', settings),
  
  // Additional methods can be added as needed
  getEmailTemplates: () => api.get('/api/settings/email-templates/'),
  
  updateEmailTemplate: (templateId, content) =>
    api.put(`/api/settings/email-templates/${templateId}/`, { content }),
    
  testEmailNotification: (templateId) =>
    api.post(`/api/settings/email-templates/${templateId}/test/`),
}

export default settingsAPI
