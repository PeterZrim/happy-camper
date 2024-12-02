import { useState } from 'react'
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Rating,
  Avatar,
  Tabs,
  Tab,
  Divider,
  Button,
} from '@mui/material'

const Reviews = () => {
  const [tabValue, setTabValue] = useState(0)

  // Placeholder data - replace with actual API call
  const reviews = [
    {
      id: 1,
      type: 'campsite',
      targetName: 'Mountain View Campground',
      userName: 'John Doe',
      rating: 4.5,
      cleanliness: 5,
      location: 4,
      value: 4,
      comment: 'Beautiful location with great amenities. The staff was very helpful.',
      date: '2024-02-15',
    },
    {
      id: 2,
      type: 'booking',
      targetName: 'Lakeside Haven',
      userName: 'Jane Smith',
      rating: 5,
      cleanliness: 5,
      location: 5,
      value: 5,
      comment: 'Perfect weekend getaway. The booking process was smooth and the campsite exceeded our expectations.',
      date: '2024-02-10',
    },
    // Add more placeholder data as needed
  ]

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Tabs for filtering reviews */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="review tabs"
        >
          <Tab label="All Reviews" />
          <Tab label="Campsite Reviews" />
          <Tab label="Booking Reviews" />
        </Tabs>
      </Box>

      {/* Reviews List */}
      <Grid container spacing={3}>
        {reviews.map((review) => (
          <Grid item key={review.id} xs={12}>
            <Card>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ mr: 2 }}>{review.userName[0]}</Avatar>
                      <Box>
                        <Typography variant="subtitle1">
                          {review.userName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {review.date}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      {review.targetName}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Rating value={review.rating} precision={0.5} readOnly />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        ({review.rating})
                      </Typography>
                    </Box>
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">
                          Cleanliness
                        </Typography>
                        <Rating value={review.cleanliness} size="small" readOnly />
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">
                          Location
                        </Typography>
                        <Rating value={review.location} size="small" readOnly />
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">
                          Value
                        </Typography>
                        <Rating value={review.value} size="small" readOnly />
                      </Grid>
                    </Grid>
                    <Typography variant="body1" paragraph>
                      {review.comment}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        variant="text"
                        color="primary"
                        onClick={() => {/* Implement reply */}}
                      >
                        Reply
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

export default Reviews
