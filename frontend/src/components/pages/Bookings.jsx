import { useState } from 'react'
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
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'

const Bookings = () => {
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)

  // Placeholder data - replace with actual API call
  const bookings = [
    {
      id: 1,
      campsite: 'Mountain View Campground',
      startDate: '2024-03-15',
      endDate: '2024-03-17',
      status: 'Confirmed',
      totalPrice: 150,
      guests: 4,
    },
    {
      id: 2,
      campsite: 'Lakeside Haven',
      startDate: '2024-04-01',
      endDate: '2024-04-03',
      status: 'Pending',
      totalPrice: 195,
      guests: 2,
    },
    // Add more placeholder data as needed
  ]

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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
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
              onClick={() => {/* Implement filter */}}
              sx={{ height: '56px' }}
            >
              Filter
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Bookings List */}
      <Grid container spacing={3}>
        {bookings.map((booking) => (
          <Grid item key={booking.id} xs={12}>
            <Card>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={8}>
                    <Typography variant="h6" gutterBottom>
                      {booking.campsite}
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Chip
                        label={booking.status}
                        color={getStatusColor(booking.status)}
                        size="small"
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Check-in: {booking.startDate}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Check-out: {booking.endDate}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Guests: {booking.guests}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="h6" color="primary" gutterBottom>
                        ${booking.totalPrice}
                      </Typography>
                      <Button
                        variant="outlined"
                        color="primary"
                        sx={{ mr: 1 }}
                        onClick={() => {/* Implement modify */}}
                      >
                        Modify
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => {/* Implement cancel */}}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}

export default Bookings
