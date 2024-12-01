import { useState } from 'react';
import {
  Box,
  Typography,
  Rating,
  TextField,
  Button,
  Card,
  CardContent,
  Stack,
  Alert,
} from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import { campsiteAPI } from '../../services/api';

function ReviewSection({ campsite, onReviewAdded }) {
  const { user, isAuthenticated } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await campsiteAPI.addReview(campsite.id, {
        rating,
        comment,
      });
      setComment('');
      setRating(5);
      setSuccess('Review submitted successfully!');
      if (onReviewAdded) {
        onReviewAdded(response.data);
      }
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to submit review');
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Reviews
      </Typography>

      {/* Review Form */}
      {isAuthenticated ? (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Write a Review
            </Typography>
            <form onSubmit={handleSubmitReview}>
              <Stack spacing={2}>
                <Box>
                  <Typography component="legend">Rating</Typography>
                  <Rating
                    name="rating"
                    value={rating}
                    onChange={(_, newValue) => setRating(newValue)}
                  />
                </Box>
                <TextField
                  fullWidth
                  label="Your Review"
                  multiline
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                />
                {error && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                  </Alert>
                )}
                {success && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    {success}
                  </Alert>
                )}
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={!comment.trim()}
                >
                  Submit Review
                </Button>
              </Stack>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Alert severity="info" sx={{ mb: 4 }}>
          Please log in to write a review
        </Alert>
      )}

      {/* Reviews List */}
      <Stack spacing={2}>
        {campsite.reviews?.length > 0 ? (
          campsite.reviews.map((review) => (
            <Card key={review.id}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle1" fontWeight="bold">
                    {review.user_name}
                  </Typography>
                  <Rating value={review.rating} readOnly size="small" />
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {new Date(review.created_at).toLocaleDateString()}
                </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  {review.comment}
                </Typography>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography variant="body1" color="text.secondary">
            No reviews yet. Be the first to review this campsite!
          </Typography>
        )}
      </Stack>
    </Box>
  );
}

export default ReviewSection;
