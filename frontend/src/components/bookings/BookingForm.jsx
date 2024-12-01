import { useState } from 'react'
import {
  Box,
  TextField,
  Typography,
  Alert,
  Paper,
  Grid,
  FormHelperText,
  Button,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Divider,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import { addDays, differenceInDays } from 'date-fns'
import { CampingOutlined, GroupOutlined, EventOutlined, AttachMoneyOutlined } from '@mui/icons-material'
import LoadingButton from '../common/LoadingButton'
import { bookingAPI } from '../../services/api'

const steps = ['Select Dates', 'Guest Details', 'Confirm Booking']

function BookingForm({ campsiteId, pricePerNight, onSuccess }) {
  const [activeStep, setActiveStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [dates, setDates] = useState({
    checkIn: null,
    checkOut: null,
  })
  const [guests, setGuests] = useState(1)
  const [guestDetails, setGuestDetails] = useState({
    name: '',
    email: '',
    phone: '',
  })

  const numberOfNights = dates.checkIn && dates.checkOut
    ? differenceInDays(dates.checkOut, dates.checkIn)
    : 0

  const totalPrice = numberOfNights * pricePerNight * guests

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!dates.checkIn || !dates.checkOut) {
      setError('Please select check-in and check-out dates')
      return
    }

    setLoading(true)
    setError(null)

    try {
      await bookingAPI.createBooking({
        campsite: campsiteId,
        check_in_date: dates.checkIn.toISOString().split('T')[0],
        check_out_date: dates.checkOut.toISOString().split('T')[0],
        number_of_guests: guests,
        guest_name: guestDetails.name,
        guest_email: guestDetails.email,
        guest_phone: guestDetails.phone,
      })
      onSuccess?.()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking')
    } finally {
      setLoading(false)
    }
  }

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <DatePicker
                label="Check-in Date"
                value={dates.checkIn}
                onChange={(newValue) => setDates({ ...dates, checkIn: newValue })}
                minDate={new Date()}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <DatePicker
                label="Check-out Date"
                value={dates.checkOut}
                onChange={(newValue) => setDates({ ...dates, checkOut: newValue })}
                minDate={dates.checkIn ? addDays(dates.checkIn, 1) : new Date()}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="number"
                label="Number of Guests"
                value={guests}
                onChange={(e) => setGuests(Math.max(1, parseInt(e.target.value)))}
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>
          </Grid>
        )
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                value={guestDetails.name}
                onChange={(e) => setGuestDetails({ ...guestDetails, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={guestDetails.email}
                onChange={(e) => setGuestDetails({ ...guestDetails, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone"
                value={guestDetails.phone}
                onChange={(e) => setGuestDetails({ ...guestDetails, phone: e.target.value })}
              />
            </Grid>
          </Grid>
        )
      case 2:
        return (
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Booking Summary
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <EventOutlined sx={{ mr: 1 }} />
                      <Typography>
                        {dates.checkIn?.toLocaleDateString()} - {dates.checkOut?.toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <GroupOutlined sx={{ mr: 1 }} />
                      <Typography>{guests} Guests</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <AttachMoneyOutlined sx={{ mr: 1 }} />
                      <Typography>Total: ${totalPrice}</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" color="text.secondary">
                * Please review all details before confirming
              </Typography>
            </CardContent>
          </Card>
        )
      default:
        return null
    }
  }

  return (
    <Paper sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <CampingOutlined sx={{ mr: 1 }} />
        Book Your Stay
      </Typography>

      <Stepper activeStep={activeStep} sx={{ my: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {getStepContent(activeStep)}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          {activeStep > 0 && (
            <Button onClick={handleBack} sx={{ mr: 1 }}>
              Back
            </Button>
          )}
          {activeStep === steps.length - 1 ? (
            <LoadingButton
              type="submit"
              variant="contained"
              loading={loading}
              disabled={!dates.checkIn || !dates.checkOut || !guestDetails.name || !guestDetails.email}
            >
              Confirm Booking
            </LoadingButton>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={
                (activeStep === 0 && (!dates.checkIn || !dates.checkOut)) ||
                (activeStep === 1 && (!guestDetails.name || !guestDetails.email))
              }
            >
              Next
            </Button>
          )}
        </Box>
      </Box>
    </Paper>
  )
}

export default BookingForm
