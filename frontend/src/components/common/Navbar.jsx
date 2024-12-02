import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material'
import AccountCircle from '@mui/icons-material/AccountCircle'
import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const { user, logout } = useAuth()

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = async () => {
    await logout()
    handleClose()
  }

  const isCampsiteOwner = () => {
    return user?.user_type === 'campsite_owner'
  }

  const isAdmin = () => {
    return user?.user_type === 'admin'
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          Happy Camper
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button
            color="inherit"
            component={RouterLink}
            to="/campsites"
            sx={{ mr: 2 }}
          >
            Campsites
          </Button>

          {user && (
            <>
              <Button
                color="inherit"
                component={RouterLink}
                to="/bookings"
                sx={{ mr: 2 }}
              >
                My Bookings
              </Button>
              <Button
                color="inherit"
                component={RouterLink}
                to="/reviews"
                sx={{ mr: 2 }}
              >
                Reviews
              </Button>
            </>
          )}

          {user && isCampsiteOwner() && (
            <Button
              color="inherit"
              component={RouterLink}
              to="/dashboard"
              sx={{ mr: 2 }}
            >
              Dashboard
            </Button>
          )}

          {user ? (
            <div>
              <IconButton
                size="large"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem
                  component={RouterLink}
                  to="/profile"
                  onClick={handleClose}
                >
                  Profile
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </div>
          ) : (
            <>
              <Button
                color="inherit"
                component={RouterLink}
                to="/login"
                sx={{ mr: 1 }}
              >
                Login
              </Button>
              <Button
                color="inherit"
                component={RouterLink}
                to="/signup"
              >
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
