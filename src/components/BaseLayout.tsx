import * as React from 'react'
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles'
import Box from '@mui/material/Box'
import MuiDrawer from '@mui/material/Drawer'
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import CssBaseline from '@mui/material/CssBaseline'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import SchoolIcon from '@mui/icons-material/School'
import SourceIcon from '@mui/icons-material/Source'
import GroupIcon from '@mui/icons-material/Group'
import { Button, Container } from '@mui/material'
import ToggleTheme from './ToggleTheme/ToggleTheme'

import { useNavigate } from 'react-router-dom'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
// import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { AuthContext } from '../context/AuthContext/AuthContext'
import { useState, useContext } from 'react'

interface SidebarElement {
  id: number
  title: string
  icon: JSX.Element
  href: string
}

const sidebarElements: SidebarElement[] = [
  {
    id: 1,
    title: 'Tutorials',
    icon: <SchoolIcon />,
    href: '/tutorials',
  },
  {
    id: 2,
    title: 'Tutorials Content',
    icon: <SourceIcon />,
    href: '/tutorial-content',
  },
  {
    id: 3,
    title: 'Categories',
    icon: <SchoolIcon />,
    href: '/Categories',
  },
  {
    id: 4,
    title: 'Admin Users',
    icon: <GroupIcon />,
    href: '/admin-users',
  },
]

const drawerWidth = 240

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
})

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
})

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}))

interface AppBarProps extends MuiAppBarProps {
  open?: boolean
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}))

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}))

export const BaseLayout: React.FC<{
  children: React.ReactNode
  title: string
}> = ({ ...props }) => {
  const theme = useTheme()
  const [open, setOpen] = useState(true)
  const { state } = useContext(AuthContext)
  const { user } = state

  const { dispatch } = useContext(AuthContext)

  const filterSidebarElements = () => {
    if (user && user.role === 'ADMIN') {
      return sidebarElements
    } else if (user && user.role === 'CONTENT_WRITER') {
      return sidebarElements.filter(
        (item) => item.title === 'Tutorials Content',
      )
    } else if (user && user.role === 'CONTENT_REVIEWER') {
      return sidebarElements.filter(
        (item) => item.title === 'Tutorials Content',
      )
    } else {
      return []
    }
  }

  // Function to handle logout
  const handleLogout = () => {
    // Dispatch a logout action to clear the authentication state
    dispatch({ type: 'LOGOUT' })
    // Redirect to the login page or perform any other action after logout
    // Example: history.push('/login');
  }

  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }
  const navigate = useNavigate()

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              {/* <IconButton
                onClick={() => navigate(-1)}
                color="inherit"
                size="large"
              >
                <ArrowBackIcon />
              </IconButton> */}
              {/* {title} */}
            </Typography>
            <ToggleTheme />
          </div>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <div style={{ display: 'flex' }}>
            <img
              src={
                theme.palette.mode === 'light'
                  ? '../../images/euronlogo.png'
                  : '../../images/Euron-darkmode-logo.png'
              }
              style={{ width: 140 }}
              alt="Logo"
            />

            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'rtl' ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </div>
        </DrawerHeader>
        <Divider />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
          }}
        >
          <Box>
            {/* <List>
              {sidebarElements.map((items) => {
                return (
                  <>
                    <ListItemButton
                      onClick={() => {
                        navigate(items.href)
                      }}
                      key={items.id}
                    >
                      <ListItemIcon>{items.icon}</ListItemIcon>
                      <ListItemText primary={items.title} />
                    </ListItemButton>
                  </>
                )
              })}
            </List> */}
            <List>
              {filterSidebarElements().map((items) => {
                return (
                  <>
                    <ListItemButton
                      onClick={() => navigate(items.href)}
                      key={items.id}
                      style={{
                        backgroundColor:
                          location.pathname === items.href
                            ? theme.palette.contrastColor.main
                            : 'inherit',
                      }}
                    >
                      <ListItemIcon>{items.icon}</ListItemIcon>
                      <ListItemText primary={items.title} />
                    </ListItemButton>
                  </>
                )
              })}
            </List>
            <Divider />
          </Box>

          <List>
            <ListItemButton
              sx={{
                minWidth: 0,
                mr: open ? 0 : 'auto',
                display: 'flex',
                justifyContent: 'flex-end',
                flexDirection: 'column',
              }}
            >
              {open && (
                <Button
                  variant="text"
                  color="primary"
                  style={{ color: 'red' }}
                  onClick={() => {
                    // LocalStorage.clear()
                    handleLogout()
                  }}
                >
                  LOGOUT
                </Button>
              )}
              <Button style={{ color: 'red' }}>
                {open == false && <ExitToAppIcon />}
              </Button>
            </ListItemButton>
          </List>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <Toolbar />
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          {props.children}
        </Container>
      </Box>
    </Box>
  )
}
