import { Backdrop, CircularProgress, Typography, Box } from '@mui/material'

function LoadingOverlay({ open, message }) {
  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
      }}
      open={open}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <CircularProgress color="inherit" />
        {message && (
          <Typography variant="h6" component="div">
            {message}
          </Typography>
        )}
      </Box>
    </Backdrop>
  )
}

export default LoadingOverlay
