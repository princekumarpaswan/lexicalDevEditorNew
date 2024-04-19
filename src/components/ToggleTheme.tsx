import { Button, Menu, MenuItem, useMediaQuery } from '@mui/material'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import { useContext, useRef, useState, useEffect } from 'react'
import { ThemeContext } from '../ThemeContext'
import { IThemeContext, IThemeMode } from '../ThemeContext/types'

const ToggleTheme: React.FC = () => {
  const { themeMode, switchThemeMode } = useContext(
    ThemeContext,
  ) as IThemeContext
  const [openMenu, setOpenMenu] = useState<boolean>(false)
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const [icon, setIcon] = useState<React.ReactNode>(
    themeMode === IThemeMode.SYSTEM ? (
      prefersDarkMode ? (
        <DarkModeIcon />
      ) : (
        <LightModeIcon />
      )
    ) : themeMode === IThemeMode.DARK ? (
      <DarkModeIcon />
    ) : (
      <LightModeIcon />
    ),
  )
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleOpen = () => {
    setOpenMenu(true)
  }

  const handleClose = () => {
    setOpenMenu(false)
  }

  const handleSwitchTheme = (mode: IThemeMode) => {
    switchThemeMode(mode)
    setOpenMenu(false)
  }

  useEffect(() => {
    updateIcon(themeMode)
  }, [themeMode])

  const updateIcon = (mode: IThemeMode) => {
    switch (mode) {
      case IThemeMode.DARK:
        setIcon(<DarkModeIcon />)
        break
      case IThemeMode.LIGHT:
        setIcon(<LightModeIcon />)
        break
      case IThemeMode.SYSTEM:
        setIcon(prefersDarkMode ? <DarkModeIcon /> : <LightModeIcon />)
        break
      default:
        break
    }
  }

  return (
    <>
      <Button
        variant="contained"
        sx={{ textTransform: 'capitalize', padding: 0, width: 0, height: 0 }}
        onClick={handleOpen}
        startIcon={icon}
        ref={buttonRef}
      ></Button>
      <Menu anchorEl={buttonRef.current} open={openMenu} onClose={handleClose} style={{marginTop: "20px"}}>
        <MenuItem
          onClick={() => {
            handleSwitchTheme(IThemeMode.DARK)
            updateIcon(IThemeMode.DARK)
          }}
          selected={themeMode === IThemeMode.DARK}
        >
          Dark
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleSwitchTheme(IThemeMode.LIGHT)
            updateIcon(IThemeMode.LIGHT)
          }}
          selected={themeMode === IThemeMode.LIGHT}
        >
          Light
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleSwitchTheme(IThemeMode.SYSTEM)
            updateIcon(IThemeMode.SYSTEM)
          }}
          selected={themeMode === IThemeMode.SYSTEM}
        >
          System
        </MenuItem>
      </Menu>
    </>
  )
}

export default ToggleTheme
