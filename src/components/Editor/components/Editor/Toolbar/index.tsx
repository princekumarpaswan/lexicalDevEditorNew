import { Grid } from '@mui/material'
import pluginsList from './toolbarIconsList'
import useOnClickListener from './useOnClickListener'
import { createPortal } from 'react-dom'
import FloatingLinkEditor from './FloatingLinkEditor'
import { useTheme } from '@mui/material/styles'

const Toolbar = () => {
  const theme = useTheme()

  const { onClick, isLink, editor, modal } = useOnClickListener()
  return (
    <Grid
      container
      sx={{
        background: theme.palette.primary.light,
        width: '100%',
        py: 1,
        px: 1,
      }}
      justifyContent="space-between"
    >
      {pluginsList.map((plugin) => (
        <Grid item key={plugin.id}>
          <plugin.Icon onClick={() => onClick(plugin.event)} />
        </Grid>
      ))}

      {isLink &&
        createPortal(<FloatingLinkEditor editor={editor} />, document.body)}

      {modal}
    </Grid>
  )
}

// mdi-material-ui

export default Toolbar
