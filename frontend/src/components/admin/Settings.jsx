import { useState, useEffect } from 'react'
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  Divider,
  Switch,
  FormControlLabel,
  Alert,
  Tabs,
  Tab,
  InputAdornment,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { settingsAPI } from '../../services/api'
import LoadingSpinner from '../common/LoadingSpinner'
import ErrorMessage from '../common/ErrorMessage'
import PageHeader from '../common/PageHeader'

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index} role="tabpanel">
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

function Settings() {
  const [activeTab, setActiveTab] = useState(0)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [settings, setSettings] = useState({
    // General Settings
    siteName: '',
    contactEmail: '',
    supportPhone: '',
    address: '',

    // Booking Settings
    maxAdvanceBookingDays: 180,
    minAdvanceBookingDays: 1,
    maxBookingLength: 14,
    allowInstantBooking: true,
    cancellationPolicyDays: 3,
    cancellationRefundPercentage: 80,

    // Notification Settings
    emailNotifications: {
      newBooking: true,
      bookingConfirmation: true,
      bookingCancellation: true,
      reviewReminder: true,
      adminNewBooking: true,
    },

    // Payment Settings
    paymentGateway: 'stripe',
    stripePublicKey: '',
    stripeSecretKey: '',
    currency: 'USD',
    taxPercentage: 0,

    // API Settings
    weatherApiKey: '',
    mapsApiKey: '',
    enableAnalytics: true,
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await settingsAPI.getSettings()
      setSettings(response.data)
      setLoading(false)
    } catch (err) {
      setError('Failed to load settings')
      setLoading(false)
    }
  }

  const handleChange = (section) => (event) => {
    const { name, value, checked } = event.target
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: event.target.type === 'checkbox' ? checked : value,
      },
    }))
  }

  const handleSimpleChange = (event) => {
    const { name, value, checked } = event.target
    setSettings((prev) => ({
      ...prev,
      [name]: event.target.type === 'checkbox' ? checked : value,
    }))
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      await settingsAPI.updateSettings(settings)
      setSuccess(true)
      setSaving(false)
    } catch (err) {
      setError('Failed to save settings')
      setSaving(false)
    }
  }

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />

  return (
    <Container maxWidth="lg">
      <PageHeader title="Settings" subtitle="Configure system settings" />

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="General" />
          <Tab label="Booking" />
          <Tab label="Notifications" />
          <Tab label="Payment" />
          <Tab label="API Keys" />
        </Tabs>

        <form onSubmit={handleSubmit}>
          {/* General Settings */}
          <TabPanel value={activeTab} index={0}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Site Name"
                  name="siteName"
                  value={settings.siteName}
                  onChange={handleSimpleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Contact Email"
                  name="contactEmail"
                  type="email"
                  value={settings.contactEmail}
                  onChange={handleSimpleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Support Phone"
                  name="supportPhone"
                  value={settings.supportPhone}
                  onChange={handleSimpleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  multiline
                  rows={3}
                  value={settings.address}
                  onChange={handleSimpleChange}
                />
              </Grid>
            </Grid>
          </TabPanel>

          {/* Booking Settings */}
          <TabPanel value={activeTab} index={1}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Maximum Advance Booking Days"
                  name="maxAdvanceBookingDays"
                  type="number"
                  value={settings.maxAdvanceBookingDays}
                  onChange={handleSimpleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Minimum Advance Booking Days"
                  name="minAdvanceBookingDays"
                  type="number"
                  value={settings.minAdvanceBookingDays}
                  onChange={handleSimpleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Maximum Booking Length (days)"
                  name="maxBookingLength"
                  type="number"
                  value={settings.maxBookingLength}
                  onChange={handleSimpleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Cancellation Policy Days"
                  name="cancellationPolicyDays"
                  type="number"
                  value={settings.cancellationPolicyDays}
                  onChange={handleSimpleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Cancellation Refund Percentage"
                  name="cancellationRefundPercentage"
                  type="number"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  }}
                  value={settings.cancellationRefundPercentage}
                  onChange={handleSimpleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.allowInstantBooking}
                      onChange={handleSimpleChange}
                      name="allowInstantBooking"
                    />
                  }
                  label="Allow Instant Booking"
                />
              </Grid>
            </Grid>
          </TabPanel>

          {/* Notification Settings */}
          <TabPanel value={activeTab} index={2}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Email Notifications
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.emailNotifications.newBooking}
                      onChange={handleChange('emailNotifications')}
                      name="newBooking"
                    />
                  }
                  label="New Booking Notification"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.emailNotifications.bookingConfirmation}
                      onChange={handleChange('emailNotifications')}
                      name="bookingConfirmation"
                    />
                  }
                  label="Booking Confirmation"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.emailNotifications.bookingCancellation}
                      onChange={handleChange('emailNotifications')}
                      name="bookingCancellation"
                    />
                  }
                  label="Booking Cancellation"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.emailNotifications.reviewReminder}
                      onChange={handleChange('emailNotifications')}
                      name="reviewReminder"
                    />
                  }
                  label="Review Reminder"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.emailNotifications.adminNewBooking}
                      onChange={handleChange('emailNotifications')}
                      name="adminNewBooking"
                    />
                  }
                  label="Admin New Booking Alert"
                />
              </Grid>
            </Grid>
          </TabPanel>

          {/* Payment Settings */}
          <TabPanel value={activeTab} index={3}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Payment Gateway"
                  name="paymentGateway"
                  select
                  SelectProps={{ native: true }}
                  value={settings.paymentGateway}
                  onChange={handleSimpleChange}
                >
                  <option value="stripe">Stripe</option>
                  <option value="paypal">PayPal</option>
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Currency"
                  name="currency"
                  select
                  SelectProps={{ native: true }}
                  value={settings.currency}
                  onChange={handleSimpleChange}
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Stripe Public Key"
                  name="stripePublicKey"
                  value={settings.stripePublicKey}
                  onChange={handleSimpleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Stripe Secret Key"
                  name="stripeSecretKey"
                  type="password"
                  value={settings.stripeSecretKey}
                  onChange={handleSimpleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Tax Percentage"
                  name="taxPercentage"
                  type="number"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  }}
                  value={settings.taxPercentage}
                  onChange={handleSimpleChange}
                />
              </Grid>
            </Grid>
          </TabPanel>

          {/* API Settings */}
          <TabPanel value={activeTab} index={4}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Weather API Key"
                  name="weatherApiKey"
                  value={settings.weatherApiKey}
                  onChange={handleSimpleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Maps API Key"
                  name="mapsApiKey"
                  value={settings.mapsApiKey}
                  onChange={handleSimpleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.enableAnalytics}
                      onChange={handleSimpleChange}
                      name="enableAnalytics"
                    />
                  }
                  label="Enable Analytics"
                />
              </Grid>
            </Grid>
          </TabPanel>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ p: 3, display: 'flex', justifyContent: 'flex-end' }}>
            {success && (
              <Alert severity="success" sx={{ mr: 2 }}>
                Settings saved successfully
              </Alert>
            )}
            <LoadingButton
              type="submit"
              variant="contained"
              loading={saving}
              disabled={saving}
            >
              Save Settings
            </LoadingButton>
          </Box>
        </form>
      </Paper>
    </Container>
  )
}

export default Settings
