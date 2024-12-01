import { useState, useEffect } from 'react'
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
} from '@mui/material'
import {
  CabinOutlined as CampingIcon,
  BookOnline as BookingIcon,
  StarOutline as ReviewIcon,
  AttachMoney as RevenueIcon,
} from '@mui/icons-material'
import { adminAPI } from '../../services/api'
import LoadingSpinner from '../common/LoadingSpinner'
import ErrorMessage from '../common/ErrorMessage'
import PageHeader from '../common/PageHeader'
import AdminStats from './AdminStats'

function StatCard({ title, value, icon: Icon, color }) {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Icon sx={{ color: `${color}.main`, fontSize: 32, mr: 1 }} />
          <Typography variant="h6" color="textSecondary">
            {title}
          </Typography>
        </Box>
        <Typography variant="h4">{value}</Typography>
      </CardContent>
    </Card>
  )
}

function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await adminAPI.getDashboardStats()
        setStats(response.data)
        setLoading(false)
      } catch (err) {
        setError('Failed to load dashboard statistics')
        setLoading(false)
      }
    }

    fetchDashboardStats()
  }, [])

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />

  return (
    <Container maxWidth="lg">
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your campsite business"
        breadcrumbs={[{ text: 'Admin', href: '/admin' }, { text: 'Dashboard' }]}
      />

      <Grid container spacing={3}>
        {/* Summary Stats */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Campsites"
            value={stats.total_campsites}
            icon={CampingIcon}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Bookings"
            value={stats.active_bookings}
            icon={BookingIcon}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Average Rating"
            value={stats.average_rating?.toFixed(1) || 'N/A'}
            icon={ReviewIcon}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Monthly Revenue"
            value={`$${stats.monthly_revenue?.toLocaleString() || 0}`}
            icon={RevenueIcon}
            color="info"
          />
        </Grid>

        {/* Charts */}
        <Grid item xs={12}>
          <AdminStats />
        </Grid>
      </Grid>
    </Container>
  )
}

export default AdminDashboard
