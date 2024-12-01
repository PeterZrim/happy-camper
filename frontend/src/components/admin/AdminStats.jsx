import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  ToggleButtonGroup,
  ToggleButton,
  Grid,
} from '@mui/material'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { adminAPI } from '../../services/api'
import LoadingSpinner from '../common/LoadingSpinner'
import ErrorMessage from '../common/ErrorMessage'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const timeRanges = [
  { value: '7days', label: '7 Days' },
  { value: '30days', label: '30 Days' },
  { value: '90days', label: '90 Days' },
]

function AdminStats() {
  const [timeRange, setTimeRange] = useState('30days')
  const [revenueData, setRevenueData] = useState(null)
  const [occupancyData, setOccupancyData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)
      setError(null)

      try {
        const [revenueResponse, occupancyResponse] = await Promise.all([
          adminAPI.getRevenueStats({ timeRange }),
          adminAPI.getOccupancyStats({ timeRange }),
        ])

        setRevenueData(revenueResponse.data)
        setOccupancyData(occupancyResponse.data)
        setLoading(false)
      } catch (err) {
        setError('Failed to load statistics')
        setLoading(false)
      }
    }

    fetchStats()
  }, [timeRange])

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />

  const revenueChartData = {
    labels: revenueData.dates,
    datasets: [
      {
        label: 'Revenue',
        data: revenueData.values,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  }

  const occupancyChartData = {
    labels: occupancyData.dates,
    datasets: [
      {
        label: 'Occupancy Rate',
        data: occupancyData.values,
        borderColor: 'rgb(255, 159, 64)',
        tension: 0.1,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <ToggleButtonGroup
            value={timeRange}
            exclusive
            onChange={(e, value) => value && setTimeRange(value)}
            size="small"
          >
            {timeRanges.map((range) => (
              <ToggleButton key={range.value} value={range.value}>
                {range.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Revenue Trend
            </Typography>
            <Line data={revenueChartData} options={chartOptions} />
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Occupancy Rate
            </Typography>
            <Line data={occupancyChartData} options={chartOptions} />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default AdminStats
