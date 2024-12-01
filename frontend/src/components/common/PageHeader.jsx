import { Box, Typography, Button, Breadcrumbs, Link } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

function PageHeader({
  title,
  subtitle,
  breadcrumbs = [],
  action,
  actionText,
  actionIcon: ActionIcon,
  onActionClick,
}) {
  return (
    <Box sx={{ mb: 4 }}>
      {breadcrumbs.length > 0 && (
        <Breadcrumbs sx={{ mb: 2 }}>
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1
            return isLast ? (
              <Typography color="text.primary" key={crumb.text}>
                {crumb.text}
              </Typography>
            ) : (
              <Link
                component={RouterLink}
                to={crumb.href}
                color="inherit"
                key={crumb.text}
              >
                {crumb.text}
              </Link>
            )
          })}
        </Breadcrumbs>
      )}

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body1" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>

        {action && onActionClick && (
          <Button
            variant="contained"
            color="primary"
            onClick={onActionClick}
            startIcon={ActionIcon && <ActionIcon />}
          >
            {actionText}
          </Button>
        )}
      </Box>
    </Box>
  )
}

export default PageHeader
