// import lexicalEditorTheme from '../../theme/lexicalEditorTheme'

import { AutoLinkNode, LinkNode } from '@lexical/link'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { CodeHighlightNode, CodeNode } from '@lexical/code'
import { TableNode, TableCellNode, TableRowNode } from '@lexical/table'
import { ListNode, ListItemNode } from '@lexical/list'
import { ImageNode } from './nodes/ImageNode'
import { ExcalidrawNode } from './nodes/ExcalidrawNode'
import { YouTubeNode } from './nodes/youtubeNode/YouTubeNode'
import { TweetNode } from './nodes/TweetNode/TweetNode'
import { FigmaNode } from './nodes/figmaNode/FigmaNode'
import PlaygroundEditorTheme from '../../../../themes/PlaygroundEditorTheme'

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: Error) {
  // eslint-disable-next-line no-console
  console.error(error)
}

const lexicalEditorConfig = {
  namespace: 'MyEditor',
  theme: PlaygroundEditorTheme,
  onError,
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    CodeHighlightNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    AutoLinkNode,
    LinkNode,
    ImageNode,
    ExcalidrawNode,
    YouTubeNode,
    TweetNode,
    FigmaNode,
    TableNode,
    TableCellNode,
    TableRowNode,
  ],
}

export default lexicalEditorConfig