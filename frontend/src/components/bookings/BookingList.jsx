import { useState, useEffect } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  TextField,
} from '@mui/material'
import axios from 'axios'
import { BookingSkeleton } from '../common/LoadingSkeleton'
import LoadingButton from '../common/LoadingButton'

const statusColors = {
  pending: 'warning',
  confirmed: 'success',
  cancelled: 'error',
  completed: 'info',
}

function BookingList() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reviewDialog, setReviewDialog] = useState({
    open: false,
    bookingId: null,
  })
  const [review, setReview] = useState({
    rating: 0,
    comment: '',
  })
  const [submittingReview, setSubmittingReview] = useState(false)
  const [cancellingBooking, setCancellingBooking] = useState(null)

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('/api/bookings/')
        setBookings(response.data)
        setLoading(false)
      } catch (err) {
        setError('Failed to fetch bookings')
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  const handleReviewSubmit = async () => {
    setSubmittingReview(true)
    try {
      await axios.post('/api/reviews/', {
        booking: reviewDialog.bookingId,
        rating: review.rating,
        comment: review.comment,
      })
      
      // Refresh bookings to show the new review
      const response = await axios.get('/api/bookings/')
      setBookings(response.data)
      
      setReviewDialog({ open: false, bookingId: null })
      setReview({ rating: 0, comment: '' })
    } catch (err) {
      console.error('Failed to submit review:', err)
    } finally {
      setSubmittingReview(false)
    }
  }

  const handleCancelBooking = async (bookingId) => {
    setCancellingBooking(bookingId)
    try {
      await axios.patch(`/api/bookings/${bookingId}/`, {
        status: 'cancelled',
      })
      
      // Refresh bookings to show the updated status
      const response = await axios.get('/api/bookings/')
      setBookings(response.data)
    } catch (err) {
      console.error('Failed to cancel booking:', err)
    } finally {
      setCancellingBooking(null)
    }
  }

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          My Bookings
        </Typography>
        <Grid container spacing={3}>
          {[1, 2, 3].map((key) => (
            <Grid item xs={12} key={key}>
              <BookingSkeleton />
            </Grid>
          ))}
        </Grid>
      </Container>
    )
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Typography color="error" variant="h6">{error}</Typography>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        My Bookings
      </Typography>

      <Grid container spacing={3}>
        {bookings.map((booking) => (
          <Grid item xs={12} key={booking.id}>
            <Card>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={8}>
                    <Typography variant="h6" component={RouterLink} to={`/campsites/${booking.campsite.id}`} sx={{ textDecoration: 'none', color: 'inherit' }}>
                      {booking.campsite.name}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body1">
                        Check-in: {new Date(booking.check_in_date).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body1">
                        Check-out: {new Date(booking.check_out_date).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body1">
                        Guests: {booking.number_of_guests}
                      </Typography>
                      <Typography variant="body1" color="primary">
                        Total: ${booking.total_price}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: { sm: 'flex-end' } }}>
                    <Chip
                      label={booking.status}
                      color={statusColors[booking.status]}
                      sx={{ mb: 2 }}
                    />
                    {booking.status === 'pending' && (
                      <LoadingButton
                        variant="outlined"
                        color="error"
                        onClick={() => handleCancelBooking(booking.id)}
                        loading={cancellingBooking === booking.id}
                        sx={{ mb: 1 }}
                      >
                        Cancel Booking
                      </LoadingButton>
                    )}
                    {booking.status === 'completed' && !booking.has_review && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setReviewDialog({ open: true, bookingId: booking.id })}
                      >
                        Leave Review
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Review Dialog */}
      <Dialog open={reviewDialog.open} onClose={() => setReviewDialog({ open: false, bookingId: null })}>
        <DialogTitle>Write a Review</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <Box>
              <Typography component="legend">Rating</Typography>
              <Rating
                value={review.rating}
                onChange={(event, newValue) => setReview({ ...review, rating: newValue })}
              />
            </Box>
            <TextField
              label="Comment"
              multiline
              rows={4}
              value={review.comment}
              onChange={(e) => setReview({ ...review, comment: e.target.value })}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewDialog({ open: false, bookingId: null })} disabled={submittingReview}>
            Cancel
          </Button>
          <LoadingButton 
            onClick={handleReviewSubmit} 
            variant="contained" 
            color="primary"
            loading={submittingReview}
          >
            Submit Review
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default BookingList
