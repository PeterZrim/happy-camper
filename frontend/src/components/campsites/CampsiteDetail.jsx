import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  Chip,
  Rating,
  Button,
  CircularProgress,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import axios from 'axios'

function CampsiteDetail() {
  const { id } = useParams()
  const [campsite, setCampsite] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false)
  const [booking, setBooking] = useState({
    checkIn: null,
    checkOut: null,
    guests: 1,
  })

  useEffect(() => {
    const fetchCampsite = async () => {
      try {
        const response = await axios.get(`/api/campsites/${id}/`)
        setCampsite(response.data)
        setLoading(false)
      } catch (err) {
        setError('Failed to fetch campsite details')
        setLoading(false)
      }
    }

    fetchCampsite()
  }, [id])

  const handleBooking = async () => {
    try {
      await axios.post('/api/bookings/', {
        campsite: id,
        check_in_date: booking.checkIn,
        check_out_date: booking.checkOut,
        number_of_guests: booking.guests,
      })
      setBookingDialogOpen(false)
      // Show success message or redirect to bookings page
    } catch (err) {
      // Handle booking error
      console.error('Booking failed:', err)
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    )
  }

  if (error || !campsite) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography color="error">{error || 'Campsite not found'}</Typography>
      </Box>
    )
  }

  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Paper
        sx={{
          position: 'relative',
          backgroundColor: 'grey.800',
          color: '#fff',
          mb: 4,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundImage: `url(${campsite.images[0]?.image || '/images/default-campsite.jpg'})`,
          minHeight: '40vh',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            backgroundColor: 'rgba(0,0,0,.3)',
          }}
        />
        <Box
          sx={{
            position: 'relative',
            p: { xs: 3, md: 6 },
          }}
        >
          <Typography component="h1" variant="h2" color="inherit" gutterBottom>
            {campsite.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Rating value={campsite.average_rating || 0} readOnly precision={0.5} />
            <Typography variant="h6">${campsite.price_per_night}/night</Typography>
          </Box>
        </Box>
      </Paper>

      <Grid container spacing={4}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Typography variant="h5" gutterBottom>
            About This Campsite
          </Typography>
          <Typography paragraph>{campsite.description}</Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            Amenities
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 4 }}>
            {campsite.has_electricity && (
              <Chip label="Electricity" color="primary" variant="outlined" />
            )}
            {campsite.has_water && <Chip label="Water" color="primary" variant="outlined" />}
            {campsite.has_toilets && <Chip label="Toilets" color="primary" variant="outlined" />}
            {campsite.has_internet && <Chip label="Internet" color="primary" variant="outlined" />}
            {campsite.has_store && <Chip label="Store" color="primary" variant="outlined" />}
          </Box>

          <Typography variant="h5" gutterBottom>
            Location
          </Typography>
          <Typography paragraph>{campsite.location}</Typography>
        </Grid>

        {/* Booking Card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Book this campsite
              </Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => setBookingDialogOpen(true)}
              >
                Check Availability
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Booking Dialog */}
      <Dialog open={bookingDialogOpen} onClose={() => setBookingDialogOpen(false)}>
        <DialogTitle>Book Campsite</DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <DatePicker
                label="Check-in Date"
                value={booking.checkIn}
                onChange={(date) => setBooking({ ...booking, checkIn: date })}
              />
              <DatePicker
                label="Check-out Date"
                value={booking.checkOut}
                onChange={(date) => setBooking({ ...booking, checkOut: date })}
              />
              <TextField
                label="Number of Guests"
                type="number"
                value={booking.guests}
                onChange={(e) => setBooking({ ...booking, guests: parseInt(e.target.value) })}
                InputProps={{ inputProps: { min: 1, max: campsite.total_spots } }}
              />
            </Box>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBookingDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleBooking} variant="contained" color="primary">
            Book Now
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default CampsiteDetail
