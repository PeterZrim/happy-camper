import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Rating,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from '@mui/material'
import axios from 'axios'
import { CampsiteSkeleton } from '../common/LoadingSkeleton'
import LoadingSpinner from '../common/LoadingSpinner'

function CampsiteList() {
  const [searchParams] = useSearchParams()
  const [campsites, setCampsites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    priceRange: 'all',
    amenities: [],
    sortBy: 'name',
  })

  useEffect(() => {
    const fetchCampsites = async () => {
      try {
        const searchQuery = searchParams.get('search') || ''
        const response = await axios.get('/api/campsites/', {
          params: {
            search: searchQuery,
            ...filters,
          },
        })
        setCampsites(response.data)
        setLoading(false)
      } catch (err) {
        setError('Failed to fetch campsites')
        setLoading(false)
      }
    }

    fetchCampsites()
  }, [searchParams, filters])

  if (loading) {
    return (
      <Container maxWidth="lg">
        {/* Show filters even during loading */}
        <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Price Range</InputLabel>
            <Select
              value={filters.priceRange}
              label="Price Range"
              disabled
            >
              <MenuItem value="all">All Prices</MenuItem>
              <MenuItem value="budget">Budget ($0-$50)</MenuItem>
              <MenuItem value="moderate">Moderate ($51-$100)</MenuItem>
              <MenuItem value="luxury">Luxury ($100+)</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={filters.sortBy}
              label="Sort By"
              disabled
            >
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="price_low">Price: Low to High</MenuItem>
              <MenuItem value="price_high">Price: High to Low</MenuItem>
              <MenuItem value="rating">Rating</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Loading skeletons */}
        <Grid container spacing={4}>
          {[1, 2, 3, 4, 5, 6].map((key) => (
            <Grid item key={key} xs={12} sm={6} md={4}>
              <CampsiteSkeleton />
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
      {/* Filters */}
      <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Price Range</InputLabel>
          <Select
            value={filters.priceRange}
            label="Price Range"
            onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
          >
            <MenuItem value="all">All Prices</MenuItem>
            <MenuItem value="budget">Budget ($0-$50)</MenuItem>
            <MenuItem value="moderate">Moderate ($51-$100)</MenuItem>
            <MenuItem value="luxury">Luxury ($100+)</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={filters.sortBy}
            label="Sort By"
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
          >
            <MenuItem value="name">Name</MenuItem>
            <MenuItem value="price_low">Price: Low to High</MenuItem>
            <MenuItem value="price_high">Price: High to Low</MenuItem>
            <MenuItem value="rating">Rating</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Campsite Grid */}
      <Grid container spacing={4}>
        {campsites.map((campsite) => (
          <Grid item key={campsite.id} xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image={campsite.images[0]?.image || '/images/default-campsite.jpg'}
                alt={campsite.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {campsite.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {campsite.description}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" color="primary">
                    ${campsite.price_per_night}/night
                  </Typography>
                  <Rating value={campsite.average_rating || 0} readOnly precision={0.5} />
                </Box>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                  {campsite.has_electricity && (
                    <Chip label="Electricity" size="small" color="primary" variant="outlined" />
                  )}
                  {campsite.has_water && (
                    <Chip label="Water" size="small" color="primary" variant="outlined" />
                  )}
                  {campsite.has_toilets && (
                    <Chip label="Toilets" size="small" color="primary" variant="outlined" />
                  )}
                  {campsite.has_internet && (
                    <Chip label="Internet" size="small" color="primary" variant="outlined" />
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}

export default CampsiteList
