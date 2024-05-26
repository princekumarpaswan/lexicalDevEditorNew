import InsertLinkOutlinedIcon from '@mui/icons-material/InsertLinkOutlined'
import FormatText from 'mdi-material-ui/FormatText'
import ImageIcon from '@mui/icons-material/Image'

export const eventTypes = {
  paragraph: 'paragraph',
  h1: 'h1',
  h2: 'h2',
  ul: 'ul',
  ol: 'ol',
  quote: 'quote',
  formatCode: 'formatCode',
  formatUndo: 'formatUndo',
  formatRedo: 'formatRedo',
  formatBold: 'formatBold',
  formatItalic: 'formatItalic',
  formatUnderline: 'formatUnderline',
  formatStrike: 'formatStrike',
  formatInsertLink: 'formatInsertLink',
  formatAlignLeft: 'formatAlignLeft',
  formatAlignCenter: 'formatAlignCenter',
  formatAlignRight: 'formatAlignRight',
  insertImage: 'insertImage',
}

const pluginsList = [
  {
    id: 1,
    Icon: FormatText,
    event: eventTypes.paragraph,
  },

  {
    id: 13,
    Icon: ImageIcon,
    event: eventTypes.insertImage,
  },
  {
    id: 14,
    Icon: InsertLinkOutlinedIcon,
    event: eventTypes.formatInsertLink,
  },
]

export default pluginsList
