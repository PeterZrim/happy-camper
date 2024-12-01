import { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  CircularProgress,
  Tabs,
  Tab,
  Card,
  CardContent,
  Divider,
  Alert,
} from '@mui/material'
import axios from 'axios'

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index} role="tabpanel">
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

function Profile() {
  const [value, setValue] = useState(0)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    old_password: '',
    new_password: '',
    confirm_password: '',
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/api/users/profile/')
        setProfile(response.data)
        setFormData({
          ...formData,
          first_name: response.data.first_name,
          last_name: response.data.last_name,
          email: response.data.email,
          phone_number: response.data.phone_number || '',
        })
        setLoading(false)
      } catch (err) {
        setError('Failed to fetch profile')
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleTabChange = (event, newValue) => {
    setValue(newValue)
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    try {
      await axios.patch('/api/users/profile/', {
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone_number: formData.phone_number,
      })
      setSuccess('Profile updated successfully')
    } catch (err) {
      setError('Failed to update profile')
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (formData.new_password !== formData.confirm_password) {
      setError('New passwords do not match')
      return
    }

    try {
      await axios.post('/api/users/change-password/', {
        old_password: formData.old_password,
        new_password: formData.new_password,
      })
      setSuccess('Password changed successfully')
      setFormData({
        ...formData,
        old_password: '',
        new_password: '',
        confirm_password: '',
      })
    } catch (err) {
      setError('Failed to change password')
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    )
  }

  if (!profile) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography color="error">Profile not found</Typography>
      </Box>
    )
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        My Profile
      </Typography>

      <Paper sx={{ width: '100%', mb: 4 }}>
        <Tabs value={value} onChange={handleTabChange} centered>
          <Tab label="Profile Information" />
          <Tab label="Change Password" />
        </Tabs>

        {error && (
          <Alert severity="error" sx={{ mt: 2, mx: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mt: 2, mx: 3 }}>
            {success}
          </Alert>
        )}

        <TabPanel value={value} index={0}>
          <form onSubmit={handleProfileUpdate}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={formData.email}
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary">
                  Update Profile
                </Button>
              </Grid>
            </Grid>
          </form>
        </TabPanel>

        <TabPanel value={value} index={1}>
          <form onSubmit={handlePasswordChange}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="password"
                  label="Current Password"
                  name="old_password"
                  value={formData.old_password}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="password"
                  label="New Password"
                  name="new_password"
                  value={formData.new_password}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="password"
                  label="Confirm New Password"
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary">
                  Change Password
                </Button>
              </Grid>
            </Grid>
          </form>
        </TabPanel>
      </Paper>

      {profile.is_owner && (
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Campsite Owner Dashboard
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Button
              variant="contained"
              color="primary"
              href="/admin/dashboard"
              sx={{ mr: 2 }}
            >
              View Dashboard
            </Button>
            <Button
              variant="outlined"
              color="primary"
              href="/admin/campsites/new"
            >
              Add New Campsite
            </Button>
          </CardContent>
        </Card>
      )}
    </Container>
  )
}

export default Profile
