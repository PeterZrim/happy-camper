import { Button, CircularProgress } from '@mui/material'

function LoadingButton({ loading, children, ...props }) {
  return (
    <Button
      disabled={loading}
      {...props}
      sx={{
        position: 'relative',
        ...(props.sx || {}),
      }}
    >
      {loading && (
        <CircularProgress
          size={24}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: '-12px',
            marginLeft: '-12px',
          }}
        />
      )}
      <span style={{ visibility: loading ? 'hidden' : 'visible' }}>
        {children}
      </span>
    </Button>
  )
}

export default LoadingButton
