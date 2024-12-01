import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
} from '@mui/material'
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Add as AddIcon,
} from '@mui/icons-material'
import { campsiteAPI } from '../../services/api'
import LoadingSpinner from '../common/LoadingSpinner'
import ErrorMessage from '../common/ErrorMessage'
import ConfirmDialog from '../common/ConfirmDialog'
import PageHeader from '../common/PageHeader'

function CampsiteManagement() {
  const navigate = useNavigate()
  const [campsites, setCampsites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    campsiteId: null,
  })

  useEffect(() => {
    fetchCampsites()
  }, [])

  const fetchCampsites = async () => {
    try {
      const response = await campsiteAPI.getCampsites()
      setCampsites(response.data)
      setLoading(false)
    } catch (err) {
      setError('Failed to load campsites')
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

  const handleDelete = async () => {
    try {
      await campsiteAPI.deleteCampsite(deleteDialog.campsiteId)
      await fetchCampsites()
      setDeleteDialog({ open: false, campsiteId: null })
    } catch (err) {
      setError('Failed to delete campsite')
    }
  }

  const filteredCampsites = campsites.filter((campsite) =>
    campsite.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const paginatedCampsites = filteredCampsites.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />

  return (
    <Container maxWidth="lg">
      <PageHeader
        title="Manage Campsites"
        subtitle="View and manage your campsite listings"
        action
        actionText="Add Campsite"
        actionIcon={AddIcon}
        onActionClick={() => navigate('/admin/campsites/new')}
      />

      <Paper sx={{ width: '100%', mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search campsites..."
          value={searchQuery}
          onChange={handleSearch}
          sx={{ p: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Price/Night</TableCell>
                <TableCell>Total Spots</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedCampsites.map((campsite) => (
                <TableRow key={campsite.id}>
                  <TableCell>{campsite.name}</TableCell>
                  <TableCell>{campsite.location}</TableCell>
                  <TableCell>${campsite.price_per_night}</TableCell>
                  <TableCell>{campsite.total_spots}</TableCell>
                  <TableCell>
                    <Chip
                      label={campsite.is_active ? 'Active' : 'Inactive'}
                      color={campsite.is_active ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => navigate(`/admin/campsites/${campsite.id}/edit`)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() =>
                        setDeleteDialog({ open: true, campsiteId: campsite.id })
                      }
                    >
                      <DeleteIcon />
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
          count={filteredCampsites.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <ConfirmDialog
        open={deleteDialog.open}
        title="Delete Campsite"
        message="Are you sure you want to delete this campsite? This action cannot be undone."
        confirmText="Delete"
        confirmColor="error"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ open: false, campsiteId: null })}
      />
    </Container>
  )
}

export default CampsiteManagement
