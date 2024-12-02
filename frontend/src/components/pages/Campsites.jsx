import { useState } from 'react'
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  TextField,
  Button,
  Rating,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

const Campsites = () => {
  const [searchTerm, setSearchTerm] = useState('')

  // Placeholder data - replace with actual API call
  const campsites = [
    {
      id: 1,
      name: 'Mountain View Campground',
      description: 'Beautiful mountain views with modern amenities',
      rating: 4.5,
      price: 50,
      image: 'https://source.unsplash.com/random/400x300/?camping',
    },
    {
      id: 2,
      name: 'Lakeside Haven',
      description: 'Peaceful lakeside camping experience',
      rating: 4.8,
      price: 65,
      image: 'https://source.unsplash.com/random/400x300/?lake,camping',
    },
    // Add more placeholder data as needed
  ]

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Search Section */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search campsites..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                endAdornment: (
                  <SearchIcon color="action" />
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={() => {/* Implement search */}}
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Campsites Grid */}
      <Grid container spacing={4}>
        {campsites.map((campsite) => (
          <Grid item key={campsite.id} xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image={campsite.image}
                alt={campsite.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {campsite.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {campsite.description}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Rating value={campsite.rating} precision={0.5} readOnly />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    ({campsite.rating})
                  </Typography>
                </Box>
                <Typography variant="h6" color="primary">
                  ${campsite.price}/night
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={() => {/* Implement booking */}}
                >
                  Book Now
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}

export default Campsites
