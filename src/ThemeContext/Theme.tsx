import { Theme, createTheme } from '@mui/material/styles'

export const AppLightTheme: Theme = createTheme({
  palette: {
    primary: {
      main: '#0052cc',
    },
    secondary: {
      main: '#edf2ff',
    },
  },
})

export const AppDarkTheme: Theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: 'rgb(33,37,39)',
    },
    secondary: {
      main: 'rgb(41,44,49)',
    },
  },
})
