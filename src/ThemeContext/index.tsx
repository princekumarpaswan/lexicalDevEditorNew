import { createContext, useEffect, useState } from 'react'
import { IThemeContext, IThemeMode } from './types'
import { AppDarkTheme, AppLightTheme } from './Theme'
import { Theme, ThemeProvider, useMediaQuery } from '@mui/material'
export const ThemeContext = createContext<IThemeContext | null>(null)
export const ThemeContextProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const [themeMode, setThemeMode] = useState<IThemeMode>(IThemeMode.LIGHT)
  const [theme, setTheme] = useState<Theme>(AppLightTheme)
  useEffect(() => {
    const initialTheme =
      (localStorage.getItem('theme') as IThemeMode) ||
      (prefersDarkMode ? IThemeMode.DARK : IThemeMode.LIGHT)
    setThemeMode(initialTheme)
    setTheme(initialTheme === IThemeMode.DARK ? AppDarkTheme : AppLightTheme)
  }, [prefersDarkMode])
  const switchThemeMode = (mode: IThemeMode) => {
    setThemeMode(mode)
    setTheme(mode === IThemeMode.DARK ? AppDarkTheme : AppLightTheme)
    localStorage.setItem('theme', mode)
  }
  return (
    <ThemeContext.Provider value={{ themeMode, switchThemeMode }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  )
}