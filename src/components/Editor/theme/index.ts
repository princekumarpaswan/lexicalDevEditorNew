import { createTheme } from '@mui/material'

const font = "'Lexend', sans-serif"

const mediaQueryTheme = createTheme()

// Define a custom palette interface that extends the default Palette interface
declare module '@mui/material/styles' {
  interface Palette {
    colors: {
      darkblue: string
      lightgreen: string
    }
  }
  interface PaletteOptions {
    colors?: {
      darkblue?: string
      lightgreen?: string
    }
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#2c3e50',
    },
    secondary: {
      main: '#fa7930ff',
      contrastText: 'white',
    },
    background: {
      default: '#f8f8f8',
    },
    colors: {
      darkblue: '#364570ff',
      lightgreen: '#9cbec6ff',
    },
  },
  typography: {
    fontFamily: font,
    h3: {
      [mediaQueryTheme.breakpoints.down('sm')]: {
        fontSize: '2rem',
      },
    },
    h4: {
      [mediaQueryTheme.breakpoints.down('sm')]: {
        fontSize: '1.75rem',
      },
    },
  },
})

export default theme
