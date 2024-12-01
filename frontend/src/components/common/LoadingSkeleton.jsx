import { Skeleton, Box, Card, CardContent } from '@mui/material'

export const CampsiteSkeleton = () => (
  <Card sx={{ mb: 2 }}>
    <Skeleton variant="rectangular" height={200} />
    <CardContent>
      <Skeleton variant="text" height={32} width="60%" sx={{ mb: 1 }} />
      <Skeleton variant="text" height={20} width="40%" sx={{ mb: 2 }} />
      <Skeleton variant="text" height={20} width="80%" sx={{ mb: 1 }} />
      <Skeleton variant="text" height={20} width="80%" />
    </CardContent>
  </Card>
)

export const ProfileSkeleton = () => (
  <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto', p: 2 }}>
    <Skeleton variant="circular" width={120} height={120} sx={{ mx: 'auto', mb: 2 }} />
    <Skeleton variant="text" height={32} width="40%" sx={{ mx: 'auto', mb: 3 }} />
    <Skeleton variant="rectangular" height={60} sx={{ mb: 2 }} />
    <Skeleton variant="rectangular" height={60} sx={{ mb: 2 }} />
    <Skeleton variant="rectangular" height={60} />
  </Box>
)

export const BookingSkeleton = () => (
  <Card sx={{ mb: 2 }}>
    <CardContent>
      <Skeleton variant="text" height={28} width="30%" sx={{ mb: 1 }} />
      <Skeleton variant="text" height={20} width="50%" sx={{ mb: 2 }} />
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Skeleton variant="text" height={20} width="25%" />
        <Skeleton variant="text" height={20} width="25%" />
      </Box>
      <Skeleton variant="rectangular" height={40} width="30%" />
    </CardContent>
  </Card>
)

export const ReviewSkeleton = () => (
  <Box sx={{ mb: 2 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
      <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
      <Box sx={{ flex: 1 }}>
        <Skeleton variant="text" height={24} width="30%" />
        <Skeleton variant="text" height={16} width="20%" />
      </Box>
    </Box>
    <Skeleton variant="text" height={20} width="90%" />
    <Skeleton variant="text" height={20} width="80%" />
  </Box>
)

export const DashboardStatsSkeleton = () => (
  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 3 }}>
    {[1, 2, 3, 4].map((key) => (
      <Card key={key}>
        <CardContent>
          <Skeleton variant="text" height={24} width="60%" sx={{ mb: 1 }} />
          <Skeleton variant="text" height={36} width="40%" />
        </CardContent>
      </Card>
    ))}
  </Box>
)

export const TableSkeleton = ({ rows = 5, columns = 4 }) => (
  <Box>
    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
      {Array(columns).fill(0).map((_, i) => (
        <Skeleton key={i} variant="text" height={24} width={`${100 / columns}%`} />
      ))}
    </Box>
    {Array(rows).fill(0).map((_, i) => (
      <Box key={i} sx={{ display: 'flex', gap: 2, mb: 1 }}>
        {Array(columns).fill(0).map((_, j) => (
          <Skeleton key={j} variant="text" height={20} width={`${100 / columns}%`} />
        ))}
      </Box>
    ))}
  </Box>
)
