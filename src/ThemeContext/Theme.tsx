import { Theme, createTheme } from '@mui/material/styles'
declare module '@mui/material/styles' {
  interface Palette {
    contrastColor: Palette['primary']
  }

  interface PaletteOptions {
    contrastColor?: PaletteOptions['primary']
  }
}

export const AppLightTheme: Theme = createTheme({
  palette: {
    contrastColor: {
      main: '#eeeeee',
      dark: '#000',
    },
  },
})

export const AppDarkTheme: Theme = createTheme({
  palette: {
    mode: 'dark',

    contrastColor: {
      main: '#212121',
      dark: '#fff',
    },
  },
})
