import { IconButton } from '@mui/material'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import { useContext, useEffect, useState } from 'react'
import { ThemeContext } from '../../ThemeContext/index'
import { IThemeContext, IThemeMode } from '../../ThemeContext/types'

const ToggleTheme: React.FC = () => {
  const { themeMode, switchThemeMode } = useContext(
    ThemeContext,
  ) as IThemeContext
  const [isDarkMode, setIsDarkMode] = useState<boolean>(
    themeMode === IThemeMode.DARK,
  )

  const handleToggleTheme = () => {
    const newThemeMode = isDarkMode ? IThemeMode.LIGHT : IThemeMode.DARK
    switchThemeMode(newThemeMode)
    setIsDarkMode(!isDarkMode)
  }

  useEffect(() => {
    setIsDarkMode(themeMode === IThemeMode.DARK)
  }, [themeMode])

  return (
    <IconButton onClick={handleToggleTheme} color="inherit">
      {isDarkMode ? <DarkModeIcon /> : <LightModeIcon />}
    </IconButton>
  )
}

export default ToggleTheme
