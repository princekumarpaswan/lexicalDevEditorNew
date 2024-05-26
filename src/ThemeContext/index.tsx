import { createContext, useEffect, useState } from 'react'
import { IThemeContext, IThemeMode } from './types'
import { AppDarkTheme, AppLightTheme } from './Theme'
import { Theme, ThemeProvider, useMediaQuery } from '@mui/material'

export const ThemeContext = createContext<IThemeContext | null>(null)

export const ThemeContextProvider: React.FC<React.PropsWithChildren> = ({
  // eslint-disable-next-line react/prop-types
  children,
}) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const [themeMode, setThemeMode] = useState<IThemeMode>(IThemeMode.LIGHT)
  const [theme, setTheme] = useState<Theme>(AppLightTheme)

  useEffect(() => {
    const initialTheme = prefersDarkMode ? IThemeMode.DARK : IThemeMode.LIGHT
    setThemeMode(initialTheme)
    setTheme(prefersDarkMode ? AppDarkTheme : AppLightTheme)
  }, [prefersDarkMode])

  const switchThemeMode = (mode: IThemeMode) => {
    setThemeMode(mode)
    setTheme(mode === IThemeMode.DARK ? AppDarkTheme : AppLightTheme)
  }

  return (
    <ThemeContext.Provider value={{ themeMode, switchThemeMode }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  )
}
