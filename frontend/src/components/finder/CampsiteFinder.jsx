import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Slider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Rating,
  Box,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { campsiteAPI } from '../../services/api';
import CampsiteCard from '../campsites/CampsiteCard';

function CampsiteFinder() {
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [minRating, setMinRating] = useState(0);
  const [filters, setFilters] = useState({
    has_electricity: false,
    has_water: false,
    has_toilets: false,
    has_internet: false,
    has_store: false,
  });

  // Results state
  const [campsites, setCampsites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle price range change
  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  // Handle amenity filter changes
  const handleFilterChange = (event) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.checked,
    });
  };

  // Search for campsites with current filters
  const searchCampsites = async () => {
    setLoading(true);
    setError('');

    try {
      const params = {
        search: searchQuery,
        min_price: priceRange[0],
        max_price: priceRange[1],
        min_rating: minRating,
        ...filters,
      };

      const response = await campsiteAPI.getCampsites(params);
      setCampsites(response.data);
    } catch (err) {
      setError('Failed to fetch campsites. Please try again.');
      console.error('Error fetching campsites:', err);
    } finally {
      setLoading(false);
    }
  };

  // Search when filters change
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchCampsites();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, priceRange, minRating, filters]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Filters Section */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Filters
              </Typography>

              {/* Search */}
              <TextField
                fullWidth
                label="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }}
              />

              {/* Price Range */}
              <Box sx={{ mb: 3 }}>
                <Typography gutterBottom>Price per night ($)</Typography>
                <Slider
                  value={priceRange}
                  onChange={handlePriceChange}
                  valueLabelDisplay="auto"
                  min={0}
                  max={500}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">${priceRange[0]}</Typography>
                  <Typography variant="body2">${priceRange[1]}</Typography>
                </Box>
              </Box>

              {/* Minimum Rating */}
              <Box sx={{ mb: 3 }}>
                <Typography gutterBottom>Minimum Rating</Typography>
                <Rating
                  value={minRating}
                  onChange={(event, newValue) => setMinRating(newValue)}
                  precision={0.5}
                />
              </Box>

              {/* Amenities */}
              <Typography gutterBottom>Amenities</Typography>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={filters.has_electricity}
                      onChange={handleFilterChange}
                      name="has_electricity"
                    />
                  }
                  label="Electricity"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={filters.has_water}
                      onChange={handleFilterChange}
                      name="has_water"
                    />
                  }
                  label="Water"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={filters.has_toilets}
                      onChange={handleFilterChange}
                      name="has_toilets"
                    />
                  }
                  label="Toilets"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={filters.has_internet}
                      onChange={handleFilterChange}
                      name="has_internet"
                    />
                  }
                  label="Internet"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={filters.has_store}
                      onChange={handleFilterChange}
                      name="has_store"
                    />
                  }
                  label="Store"
                />
              </FormGroup>
            </CardContent>
          </Card>
        </Grid>

        {/* Results Section */}
        <Grid item xs={12} md={9}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={3}>
              {campsites.length > 0 ? (
                campsites.map((campsite) => (
                  <Grid item key={campsite.id} xs={12} sm={6} md={4}>
                    <CampsiteCard campsite={campsite} />
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Alert severity="info">
                    No campsites found matching your criteria. Try adjusting your filters.
                  </Alert>
                </Grid>
              )}
            </Grid>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}

export default CampsiteFinder;
