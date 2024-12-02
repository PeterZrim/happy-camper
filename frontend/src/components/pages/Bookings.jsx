import { useState, useEffect } from 'react'
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Divider,
  Paper,
  Alert,
  Snackbar,
  CircularProgress,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import bookingsApi from '../../services/bookingsApi'

const Bookings = () => {
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  // Fetch bookings on component mount and when filters change
  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async (filters = {}) => {
    try {
      setLoading(true)
      const data = await bookingsApi.getBookings(filters)
      setBookings(data)
      setError(null)
    } catch (err) {
      setError('Failed to fetch bookings. Please try again.')
      console.error('Error fetching bookings:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleFilter = () => {
    const filters = {
      startDate: startDate ? dayjs(startDate).format('YYYY-MM-DD') : null,
      endDate: endDate ? dayjs(endDate).format('YYYY-MM-DD') : null,
    }
    fetchBookings(filters)
  }

  const handleCancel = async (bookingId) => {
    try {
      await bookingsApi.cancelBooking(bookingId)
      setSnackbar({
        open: true,
        message: 'Booking cancelled successfully',
        severity: 'success',
      })
      fetchBookings() // Refresh the list
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || 'Failed to cancel booking',
        severity: 'error',
      })
    }
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'success'
      case 'pending':
        return 'warning'
      case 'cancelled':
        return 'error'
      default:
        return 'default'
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

      {/* Filter Section */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Filter Bookings
        </Typography>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <DatePicker
              label="Check-in Date"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <DatePicker
              label="Check-out Date"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              slotProps={{ textField: { fullWidth: true } }}
              minDate={startDate}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleFilter}
              sx={{ height: '56px' }}
            >
              Filter
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Bookings List */}
      {bookings.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No bookings found
          </Typography>
        </Paper>
      ) : (
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
                      <Box sx={{ mb: 2 }}>
                        <Chip
                          label={booking.status}
                          color={getStatusColor(booking.status)}
                          size="small"
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Check-in: {dayjs(booking.check_in_date).format('MMM D, YYYY')}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Check-out: {dayjs(booking.check_out_date).format('MMM D, YYYY')}
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
                        {booking.status !== 'cancelled' && (
                          <>
                            <Button
                              variant="outlined"
                              color="error"
                              onClick={() => handleCancel(booking.id)}
                            >
                              Cancel
                            </Button>
                          </>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default Bookings
