import { createContext, useEffect, useState } from 'react'
import { IThemeContext, IThemeMode } from './types'
import { AppDarkTheme, AppLightTheme } from './Theme'
import { Theme, ThemeProvider, useMediaQuery } from '@mui/material'

export const ThemeContext = createContext<IThemeContext | null>(null)

export const ThemeContextProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [themeMode, setThemeMode] = useState<IThemeMode>(IThemeMode.LIGHT)
  const [theme, setTheme] = useState<Theme>(AppLightTheme)

  const SYSTEM_THEME: Exclude<IThemeMode, IThemeMode.SYSTEM> = useMediaQuery(
    '(prefers-color-scheme: dark)'
  )
    ? IThemeMode.DARK
    : IThemeMode.LIGHT

  useEffect(() => {
    switch (themeMode) {
      case IThemeMode.LIGHT:
        setTheme(AppLightTheme)
        break
      case IThemeMode.DARK:
        setTheme(AppDarkTheme)
        break
      case IThemeMode.SYSTEM:
        switch (SYSTEM_THEME) {
          case IThemeMode.LIGHT:
            setTheme(AppLightTheme)
            break
          case IThemeMode.DARK:
            setTheme(AppDarkTheme)
            break
        }
        break
      default:
        setTheme(AppLightTheme)
        break
    }
  }, [themeMode, SYSTEM_THEME])

  const switchThemeMode = (mode: IThemeMode) => {
    setThemeMode(mode)
  }

  return (
    <ThemeContext.Provider value={{ themeMode, switchThemeMode }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  )
}
