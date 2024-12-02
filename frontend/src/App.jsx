import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import theme from './theme'

// Components
import Navbar from './components/common/Navbar'

// Pages
import Home from './components/pages/Home'
import Login from './components/pages/Login'
import Signup from './components/pages/Signup'
import Campsites from './components/pages/Campsites'
import Bookings from './components/pages/Bookings'
import Reviews from './components/pages/Reviews'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CssBaseline />
        <div className="app">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/campsites" element={<Campsites />} />
              <Route path="/bookings" element={<Bookings />} />
              <Route path="/reviews" element={<Reviews />} />
            </Routes>
          </main>
        </div>
      </LocalizationProvider>
    </ThemeProvider>
  )
}

export default App
