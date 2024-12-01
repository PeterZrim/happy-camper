import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Rating,
  Box,
  Button,
  Stack,
  Chip,
} from '@mui/material';
import {
  ElectricBolt,
  Water,
  Wc,
  Wifi,
  Store,
  DirectionsOutlined,
  EventAvailable,
} from '@mui/icons-material';

function CampsiteCard({ campsite }) {
  const navigate = useNavigate();

  const amenityIcons = [
    { condition: campsite.has_electricity, icon: ElectricBolt, label: 'Electricity' },
    { condition: campsite.has_water, icon: Water, label: 'Water' },
    { condition: campsite.has_toilets, icon: Wc, label: 'Toilets' },
    { condition: campsite.has_internet, icon: Wifi, label: 'Internet' },
    { condition: campsite.has_store, icon: Store, label: 'Store' },
  ];

  return (
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
        image={campsite.image_url || '/images/default-campsite.jpg'}
        alt={campsite.name}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="h2">
          {campsite.name}
        </Typography>
        
        {/* Rating */}
        {campsite.average_rating && (
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <Rating value={campsite.average_rating} precision={0.5} readOnly size="small" />
            <Typography variant="body2" color="text.secondary">
              ({campsite.reviews?.length || 0} reviews)
            </Typography>
          </Stack>
        )}

        {/* Location */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {campsite.location}
        </Typography>

        {/* Description */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {campsite.description}
        </Typography>

        {/* Amenities */}
        <Box sx={{ mb: 2 }}>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {amenityIcons.map(
              ({ condition, icon: Icon, label }) =>
                condition && (
                  <Chip
                    key={label}
                    icon={<Icon fontSize="small" />}
                    label={label}
                    size="small"
                    sx={{ mb: 1 }}
                  />
                )
            )}
          </Stack>
        </Box>

        {/* Price */}
        <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
          ${campsite.price_per_night}/night
        </Typography>

        {/* Actions */}
        <Stack direction="row" spacing={1}>
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
        </Stack>
      </CardContent>
    </Card>
  );
}

export default CampsiteCard;
