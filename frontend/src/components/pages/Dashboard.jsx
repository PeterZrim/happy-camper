import { useState, useEffect } from 'react'
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material'
import { useAuth } from '../../contexts/AuthContext'
import campsitesApi from '../../services/campsitesApi'
import bookingsApi from '../../services/bookingsApi'

const Dashboard = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState(0)
  const [campsites, setCampsites] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [campsitesResponse, bookingsResponse] = await Promise.all([
        campsitesApi.getMyCampsites(),
        bookingsApi.getBookings({ status: 'pending' }),
      ])
      setCampsites(campsitesResponse)
      setBookings(bookingsResponse)
      setError(null)
    } catch (err) {
      setError('Failed to fetch dashboard data')
      console.error('Dashboard error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  const handleAddCampsite = () => {
    // TODO: Implement add campsite functionality
  }

  const handleEditCampsite = (campsiteId) => {
    // TODO: Implement edit campsite functionality
  }

  const handleDeleteCampsite = async (campsiteId) => {
    try {
      await campsitesApi.deleteCampsite(campsiteId)
      setCampsites(campsites.filter(site => site.id !== campsiteId))
    } catch (err) {
      setError('Failed to delete campsite')
    }
  }

  const handleBookingAction = async (bookingId, action) => {
    try {
      if (action === 'confirm') {
        await bookingsApi.updateBooking(bookingId, { status: 'confirmed' })
      } else if (action === 'cancel') {
        await bookingsApi.cancelBooking(bookingId)
      }
      // Refresh bookings
      const updatedBookings = await bookingsApi.getBookings({ status: 'pending' })
      setBookings(updatedBookings)
    } catch (err) {
      setError(`Failed to ${action} booking`)
    }
  }

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome, {user?.username}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your campsites and bookings
        </Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="My Campsites" />
          <Tab label="Pending Bookings" />
        </Tabs>
      </Box>

      {activeTab === 0 && (
        <>
          <Box sx={{ mb: 3 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddCampsite}
            >
              Add New Campsite
            </Button>
          </Box>

          <Grid container spacing={3}>
            {campsites.map((campsite) => (
              <Grid item key={campsite.id} xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {campsite.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {campsite.description}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2">
                        Price: ${campsite.price_per_night}/night
                      </Typography>
                      <Typography variant="body2">
                        Capacity: {campsite.total_spots} spots
                      </Typography>
                    </Box>
                    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                      <Button
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => handleEditCampsite(campsite.id)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDeleteCampsite(campsite.id)}
                      >
                        Delete
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {activeTab === 1 && (
        <Grid container spacing={3}>
          {bookings.map((booking) => (
            <Grid item key={booking.id} xs={12}>
              <Card>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={8}>
                      <Typography variant="h6" gutterBottom>
                        {booking.campsite_name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Guest: {booking.user}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Check-in: {new Date(booking.check_in_date).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Check-out: {new Date(booking.check_out_date).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Guests: {booking.number_of_guests}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="h6" color="primary" gutterBottom>
                          ${booking.total_price}
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            sx={{ mr: 1 }}
                            onClick={() => handleBookingAction(booking.id, 'confirm')}
                          >
                            Confirm
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => handleBookingAction(booking.id, 'cancel')}
                          >
                            Decline
                          </Button>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  )
}

export default Dashboard
