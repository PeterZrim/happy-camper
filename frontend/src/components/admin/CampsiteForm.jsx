import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Container,
  Paper,
  Grid,
  TextField,
  FormControlLabel,
  Switch,
  Button,
  Box,
  Alert,
} from '@mui/material'
import { campsiteAPI } from '../../services/api'
import { validateCampsiteForm } from '../../utils/validationUtils'
import LoadingSpinner from '../common/LoadingSpinner'
import ErrorMessage from '../common/ErrorMessage'
import PageHeader from '../common/PageHeader'
import ImageUpload from '../common/ImageUpload'

function CampsiteForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = !!id

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    price_per_night: '',
    total_spots: '',
    has_electricity: false,
    has_water: false,
    has_toilets: false,
    has_internet: false,
    has_store: false,
    is_active: true,
  })
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [validationErrors, setValidationErrors] = useState({})

  useEffect(() => {
    if (isEditing) {
      fetchCampsite()
    }
  }, [id])

  const fetchCampsite = async () => {
    try {
      const response = await campsiteAPI.getCampsite(id)
      const campsite = response.data
      setFormData({
        name: campsite.name,
        description: campsite.description,
        location: campsite.location,
        price_per_night: campsite.price_per_night,
        total_spots: campsite.total_spots,
        has_electricity: campsite.has_electricity,
        has_water: campsite.has_water,
        has_toilets: campsite.has_toilets,
        has_internet: campsite.has_internet,
        has_store: campsite.has_store,
        is_active: campsite.is_active,
      })
      setImages(campsite.images.map(img => ({ url: img.image })))
      setLoading(false)
    } catch (err) {
      setError('Failed to load campsite')
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    // Clear validation error when field is edited
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: null }))
    }
  }

  const handleImageUpload = async (imageData) => {
    setImages(prev => [...prev, imageData])
  }

  const handleImageDelete = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setValidationErrors({})

    // Validate form
    const { isValid, errors } = validateCampsiteForm(formData)
    if (!isValid) {
      setValidationErrors(errors)
      return
    }

    setSaving(true)
    try {
      let response
      if (isEditing) {
        response = await campsiteAPI.updateCampsite(id, formData)
      } else {
        response = await campsiteAPI.createCampsite(formData)
      }

      // Upload new images
      const newImages = images.filter(img => img.file)
      for (const image of newImages) {
        const formData = new FormData()
        formData.append('image', image.file)
        await campsiteAPI.uploadImage(response.data.id, formData)
      }

      navigate('/admin/campsites')
    } catch (err) {
      setError('Failed to save campsite')
      setSaving(false)
    }
  }

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />

  return (
    <Container maxWidth="lg">
      <PageHeader
        title={isEditing ? 'Edit Campsite' : 'Add New Campsite'}
        breadcrumbs={[
          { text: 'Admin', href: '/admin' },
          { text: 'Campsites', href: '/admin/campsites' },
          { text: isEditing ? 'Edit' : 'New' },
        ]}
      />

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Campsite Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                error={!!validationErrors.name}
                helperText={validationErrors.name}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                multiline
                rows={4}
                error={!!validationErrors.description}
                helperText={validationErrors.description}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                error={!!validationErrors.location}
                helperText={validationErrors.location}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price per Night"
                name="price_per_night"
                type="number"
                value={formData.price_per_night}
                onChange={handleInputChange}
                error={!!validationErrors.price_per_night}
                helperText={validationErrors.price_per_night}
                InputProps={{ startAdornment: '$' }}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Total Spots"
                name="total_spots"
                type="number"
                value={formData.total_spots}
                onChange={handleInputChange}
                error={!!validationErrors.total_spots}
                helperText={validationErrors.total_spots}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.has_electricity}
                      onChange={handleInputChange}
                      name="has_electricity"
                    />
                  }
                  label="Electricity"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.has_water}
                      onChange={handleInputChange}
                      name="has_water"
                    />
                  }
                  label="Water"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.has_toilets}
                      onChange={handleInputChange}
                      name="has_toilets"
                    />
                  }
                  label="Toilets"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.has_internet}
                      onChange={handleInputChange}
                      name="has_internet"
                    />
                  }
                  label="Internet"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.has_store}
                      onChange={handleInputChange}
                      name="has_store"
                    />
                  }
                  label="Store"
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_active}
                    onChange={handleInputChange}
                    name="is_active"
                  />
                }
                label="Active Listing"
              />
            </Grid>

            <Grid item xs={12}>
              <ImageUpload
                images={images}
                onUpload={handleImageUpload}
                onDelete={handleImageDelete}
                maxImages={5}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/admin/campsites')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Campsite'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  )
}

export default CampsiteForm
