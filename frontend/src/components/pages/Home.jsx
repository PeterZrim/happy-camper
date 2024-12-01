import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
} from '@mui/material'
import { Search as SearchIcon, DirectionsOutlined, EventAvailable } from '@mui/icons-material'

function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(`/campsites?search=${searchQuery}`)
  }

  // Static featured campsites data
  const featuredCampsites = [
    {
      id: 1,
      name: "Mountain Vista Campground",
      description: "Beautiful mountain views with pristine hiking trails nearby.",
      price_per_night: 45,
      image_url: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    },
    {
      id: 2,
      name: "Lakeside Haven",
      description: "Peaceful lakefront camping with excellent fishing opportunities.",
      price_per_night: 55,
      image_url: "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    },
    {
      id: 3,
      name: "Forest Retreat",
      description: "Secluded forest camping experience with modern amenities.",
      price_per_night: 40,
      image_url: "https://images.unsplash.com/photo-1537225228614-56cc3556d7ed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    }
  ]

  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Box
        sx={{
          pt: 8,
          pb: 6,
          textAlign: 'center',
          background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url("https://images.unsplash.com/photo-1510312305653-8ed496efae75?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1474&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: 2,
          color: 'white',
          mb: 6,
          minHeight: '400px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Typography
          component="h1"
          variant="h2"
          sx={{
            fontWeight: 'bold',
            mb: 4,
          }}
        >
          Find Your Perfect Camping Spot
        </Typography>
        
        <Box
          component="form"
          onSubmit={handleSearch}
          sx={{
            display: 'flex',
            gap: 1,
            maxWidth: 600,
            mx: 'auto',
            px: 3,
          }}
        >
          <TextField
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for campsites..."
            sx={{ 
              backgroundColor: 'white',
              borderRadius: 1,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'transparent',
                },
                '&:hover fieldset': {
                  borderColor: 'transparent',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'transparent',
                },
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
            startIcon={<SearchIcon />}
          >
            Search
          </Button>
        </Box>
      </Box>

      {/* Featured Campsites */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" sx={{ mb: 4 }}>
          Featured Campsites
        </Typography>
        <Grid container spacing={4}>
          {featuredCampsites.map((campsite) => (
            <Grid item key={campsite.id} xs={12} sm={6} md={4}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={campsite.image_url}
                  alt={campsite.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {campsite.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {campsite.description}
                  </Typography>
                  <Typography variant="h6" color="primary">
                    ${campsite.price_per_night}/night
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    startIcon={<DirectionsOutlined />}
                    onClick={() => navigate(`/campsites/${campsite.id}`)}
                  >
                    View Details
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    startIcon={<EventAvailable />}
                    onClick={() => navigate(`/book/${campsite.id}`)}
                  >
                    Book Now
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Features Section */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" sx={{ mb: 4 }}>
          Why Choose Happy Camper?
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Easy Booking
                </Typography>
                <Typography variant="body2">
                  Simple, secure booking process with instant confirmation.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Verified Locations
                </Typography>
                <Typography variant="body2">
                  All campsites are verified and regularly inspected for quality.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  24/7 Support
                </Typography>
                <Typography variant="body2">
                  Our support team is always here to help with your booking.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}

export default Home