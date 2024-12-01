import { useState } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Link,
  Alert,
  FormControlLabel,
  Checkbox,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material'
import { authAPI } from '../../services/api'

const steps = ['Account Details', 'Personal Information', 'Account Type']

function Register() {
  const navigate = useNavigate()
  const [activeStep, setActiveStep] = useState(0)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirm_password: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    is_owner: false,
  })
  const [error, setError] = useState(null)

  const handleInputChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setFormData({
      ...formData,
      [e.target.name]: value,
    })
  }

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1)
  }

  const validateStep = () => {
    switch (activeStep) {
      case 0:
        if (!formData.email || !formData.password || !formData.confirm_password) {
          setError('Please fill in all fields')
          return false
        }
        if (formData.password !== formData.confirm_password) {
          setError('Passwords do not match')
          return false
        }
        if (formData.password.length < 8) {
          setError('Password must be at least 8 characters long')
          return false
        }
        break
      case 1:
        if (!formData.first_name || !formData.last_name) {
          setError('Please fill in all fields')
          return false
        }
        break
      default:
        break
    }
    setError(null)
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateStep()) return

    if (activeStep < steps.length - 1) {
      handleNext()
      return
    }

    try {
      const response = await authAPI.register(formData)
      localStorage.setItem('token', response.data.token)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.')
    }
  }

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              sx={{ mb: 2 }}
              helperText="Password must be at least 8 characters long"
            />
            <TextField
              fullWidth
              label="Confirm Password"
              name="confirm_password"
              type="password"
              value={formData.confirm_password}
              onChange={handleInputChange}
              required
              sx={{ mb: 2 }}
            />
          </>
        )
      case 1:
        return (
          <>
            <TextField
              fullWidth
              label="First Name"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Last Name"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Phone Number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
          </>
        )
      case 2:
        return (
          <>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Choose your account type:
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.is_owner}
                  onChange={handleInputChange}
                  name="is_owner"
                />
              }
              label="I want to list my campsites (Become a Campsite Owner)"
            />
            <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
              {formData.is_owner
                ? 'As a campsite owner, you can list and manage your campsites, handle bookings, and interact with campers.'
                : 'As a camper, you can discover and book amazing camping experiences.'}
            </Typography>
          </>
        )
      default:
        return null
    }
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Create Account
          </Typography>
          <Typography variant="body1" align="center" color="textSecondary" sx={{ mb: 4 }}>
            Join Happy Camper and start your camping adventure
          </Typography>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            {renderStepContent(activeStep)}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                onClick={handleBack}
                disabled={activeStep === 0}
                variant="outlined"
              >
                Back
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
              >
                {activeStep === steps.length - 1 ? 'Create Account' : 'Next'}
              </Button>
            </Box>
          </form>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2">
              Already have an account?{' '}
              <Link component={RouterLink} to="/login">
                Sign in
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}

export default Register
