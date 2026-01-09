import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.tsx'

// Import Poppins font
import '@fontsource/poppins/400.css'
import '@fontsource/poppins/500.css'
import '@fontsource/poppins/600.css'
import '@fontsource/poppins/700.css'
import '@fontsource/poppins/800.css'
import '@fontsource/poppins/900.css'

const theme = createTheme({
  palette: {
    primary: { main: '#3b82f6' }, // blue moderne
    secondary: { main: '#06b6d4' }, // cyan pour les accents
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: 'Poppins, sans-serif',
    h1: { fontFamily: 'Poppins, sans-serif', fontWeight: 900 },
    h2: { fontFamily: 'Poppins, sans-serif', fontWeight: 800 },
    h3: { fontFamily: 'Poppins, sans-serif', fontWeight: 700 },
    h4: { fontFamily: 'Poppins, sans-serif', fontWeight: 700 },
    h5: { fontFamily: 'Poppins, sans-serif', fontWeight: 600 },
    h6: { fontFamily: 'Poppins, sans-serif', fontWeight: 600 },
    button: { fontFamily: 'Poppins, sans-serif', fontWeight: 700 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 700,
          borderRadius: 8,
          fontFamily: 'Poppins, sans-serif',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 18,
        },
      },
    },
  },
})

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
)
