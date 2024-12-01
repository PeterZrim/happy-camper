import { Box, Typography, Button } from '@mui/material'
import { Warning as WarningIcon } from '@mui/icons-material'

function ErrorMessage({
  message = 'An error occurred',
  retry = null,
  goBack = null,
}) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="60vh"
      gap={2}
    >
      <WarningIcon color="error" sx={{ fontSize: 48 }} />
      <Typography variant="h6" color="error" align="center">
        {message}
      </Typography>
      <Box display="flex" gap={2}>
        {retry && (
          <Button variant="contained" color="primary" onClick={retry}>
            Try Again
          </Button>
        )}
        {goBack && (
          <Button variant="outlined" color="primary" onClick={goBack}>
            Go Back
          </Button>
        )}
      </Box>
    </Box>
  )
}

export default ErrorMessage
