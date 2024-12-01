import { useState, useEffect } from 'react'
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  TablePagination,
  TextField,
  InputAdornment,
  Box,
  Button,
  Menu,
  MenuItem,
} from '@mui/material'
import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material'
import { bookingAPI } from '../../services/api'
import { formatDate, formatDateTime } from '../../utils/dateUtils'
import LoadingSpinner from '../common/LoadingSpinner'
import ErrorMessage from '../common/ErrorMessage'
import ConfirmDialog from '../common/ConfirmDialog'
import PageHeader from '../common/PageHeader'

const statusColors = {
  pending: 'warning',
  confirmed: 'success',
  cancelled: 'error',
  completed: 'info',
}

function BookingManagement() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [actionMenu, setActionMenu] = useState({
    anchorEl: null,
    booking: null,
  })
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    message: '',
    action: null,
  })

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const response = await bookingAPI.getBookings()
      setBookings(response.data)
      setLoading(false)
    } catch (err) {
      setError('Failed to load bookings')
      setLoading(false)
    }
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleSearch = (event) => {
    setSearchQuery(event.target.value)
    setPage(0)
  }

  const handleStatusFilter = (status) => {
    setStatusFilter(status)
    setPage(0)
  }

  const handleActionClick = (event, booking) => {
    setActionMenu({
      anchorEl: event.currentTarget,
      booking,
    })
  }

  const handleActionClose = () => {
    setActionMenu({
      anchorEl: null,
      booking: null,
    })
  }

  const handleConfirmBooking = async () => {
    try {
      await bookingAPI.updateBooking(actionMenu.booking.id, {
        status: 'confirmed',
      })
      await fetchBookings()
      handleActionClose()
    } catch (err) {
      setError('Failed to confirm booking')
    }
  }

  const handleCancelBooking = async () => {
    try {
      await bookingAPI.updateBooking(actionMenu.booking.id, {
        status: 'cancelled',
      })
      await fetchBookings()
      handleActionClose()
    } catch (err) {
      setError('Failed to cancel booking')
    }
  }

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.campsite.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const paginatedBookings = filteredBookings.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />

  return (
    <Container maxWidth="lg">
      <PageHeader
        title="Manage Bookings"
        subtitle="View and manage campsite bookings"
      />

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Box sx={{ p: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search bookings..."
            value={searchQuery}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ flexGrow: 1 }}
          />

          <Box>
            <Button
              variant={statusFilter === 'all' ? 'contained' : 'outlined'}
              onClick={() => handleStatusFilter('all')}
              size="small"
              sx={{ mr: 1 }}
            >
              All
            </Button>
            <Button
              variant={statusFilter === 'pending' ? 'contained' : 'outlined'}
              onClick={() => handleStatusFilter('pending')}
              size="small"
              sx={{ mr: 1 }}
            >
              Pending
            </Button>
            <Button
              variant={statusFilter === 'confirmed' ? 'contained' : 'outlined'}
              onClick={() => handleStatusFilter('confirmed')}
              size="small"
              sx={{ mr: 1 }}
            >
              Confirmed
            </Button>
            <Button
              variant={statusFilter === 'cancelled' ? 'contained' : 'outlined'}
              onClick={() => handleStatusFilter('cancelled')}
              size="small"
            >
              Cancelled
            </Button>
          </Box>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Booking ID</TableCell>
                <TableCell>Campsite</TableCell>
                <TableCell>Guest</TableCell>
                <TableCell>Check-in</TableCell>
                <TableCell>Check-out</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Total</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>{booking.id}</TableCell>
                  <TableCell>{booking.campsite.name}</TableCell>
                  <TableCell>{booking.user.email}</TableCell>
                  <TableCell>{formatDate(booking.check_in_date)}</TableCell>
                  <TableCell>{formatDate(booking.check_out_date)}</TableCell>
                  <TableCell>
                    <Chip
                      label={booking.status}
                      color={statusColors[booking.status]}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>${booking.total_price}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={(e) => handleActionClick(e, booking)}>
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredBookings.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <Menu
        anchorEl={actionMenu.anchorEl}
        open={Boolean(actionMenu.anchorEl)}
        onClose={handleActionClose}
      >
        {actionMenu.booking?.status === 'pending' && (
          <MenuItem
            onClick={() =>
              setConfirmDialog({
                open: true,
                title: 'Confirm Booking',
                message: 'Are you sure you want to confirm this booking?',
                action: handleConfirmBooking,
              })
            }
          >
            <CheckCircleIcon sx={{ mr: 1 }} /> Confirm Booking
          </MenuItem>
        )}
        {['pending', 'confirmed'].includes(actionMenu.booking?.status) && (
          <MenuItem
            onClick={() =>
              setConfirmDialog({
                open: true,
                title: 'Cancel Booking',
                message: 'Are you sure you want to cancel this booking?',
                action: handleCancelBooking,
              })
            }
          >
            <CancelIcon sx={{ mr: 1 }} /> Cancel Booking
          </MenuItem>
        )}
      </Menu>

      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={() => {
          confirmDialog.action()
          setConfirmDialog({ open: false, title: '', message: '', action: null })
        }}
        onCancel={() =>
          setConfirmDialog({ open: false, title: '', message: '', action: null })
        }
      />
    </Container>
  )
}

export default BookingManagement
