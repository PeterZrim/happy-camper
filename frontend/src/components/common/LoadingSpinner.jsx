import { Box, CircularProgress, Typography } from '@mui/material'

function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="60vh"
      gap={2}
    >
      <CircularProgress />
      {message && (
        <Typography variant="body1" color="textSecondary">
          {message}
        </Typography>
      )}
    </Box>
  )
}

export default LoadingSpinner
