/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import { useContext, useEffect } from 'react'
import './styles.css'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'
import { MuiContentEditable, placeHolderSx } from './styles'
import { Box } from '@mui/material'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin'
import ImagesPlugin from '../plugin/ImagePlugin'
import { ClearEditorPlugin } from '../plugin/LexicalClearEditorPlugin'
import ToolbarPlugin from './newToolbar/index'
import ExcalidrawPlugin from '../plugin/ExcalidrawPlugin'
import YouTubePlugin from '../plugin/YouTubePlugin'
import AutoEmbedPlugin from '../plugin/AutoEmbedPlugin'
import { TableContext } from '../plugin/TablePlugin'
import TableCellResizer from '../plugin/TableCellResizer'
import { useSettings } from '../../../../../context/SettingsContext'
import TableOfContentsPlugin from '../plugin/TableOfContentsPlugin'
import { TablePlugin } from '@lexical/react/LexicalTablePlugin'
import EquationsPlugin from '../plugin/EquationsPlugin'
import CommentPlugin from '../plugin/CommentPlugin'
import { AutoLinkNode, LinkNode } from '@lexical/link'
import { HeadingNode } from '@lexical/rich-text'
import { CodeHighlightNode, CodeNode } from '@lexical/code'
import { TableNode, TableCellNode, TableRowNode } from '@lexical/table'
import { ListNode, ListItemNode } from '@lexical/list'
import { ImageNode } from '../nodes/ImageNode'
import { ExcalidrawNode } from '../nodes/ExcalidrawNode'
import { YouTubeNode } from '../nodes/youtubeNode/YouTubeNode'
import { TweetNode } from '../nodes/TweetNode/TweetNode'
import { FigmaNode } from '../nodes/figmaNode/FigmaNode'
import PlaygroundEditorTheme from '../../../../../themes/PlaygroundEditorTheme'
import { EquationNode } from '../nodes/EquationNode'
import { MarkNode } from '@lexical/mark'
import { ThemeContext } from '../../../../../ThemeContext'
import { IThemeMode } from '../../../../../ThemeContext/types'
import { AuthContext } from '../../../../../context/AuthContext/AuthContext'
import ContentContext from '../../../../../context/contentText'
type EditorWrapperProps = {
  onEditorChange: (editorStateJSONString: string) => void
  initialContent?: any
  status?: any
}
function EditorWrapper({
  onEditorChange,
  status,
  initialContent
}: EditorWrapperProps) {
  

  const { content, setContent } = useContext(ContentContext)
  const { state } = useContext(AuthContext)
  const role = state.user?.role
  const initialConfig = {
    namespace: 'Editor ',
    theme: PlaygroundEditorTheme,
    onError: (error: unknown) => console.log(error),
    editorState: initialContent && initialContent.content,
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      // QuoteNode,
      CodeNode,
      CodeHighlightNode,
      AutoLinkNode,
      LinkNode,
      ImageNode,
      ExcalidrawNode,
      YouTubeNode,
      TweetNode,
      FigmaNode,
      EquationNode,
      TableCellNode,
      TableNode,
      TableRowNode,
      MarkNode,
    ],
  }
  useEffect(() => {
    setContent(initialContent)
  },[content, initialContent, setContent])

  const {
    settings: {
      showTableOfContents,
      tableCellMerge,
      tableCellBackgroundColor,
    },
  } = useSettings()

  const themeContext = useContext(ThemeContext)
  if (!themeContext) {
    throw new Error('YourComponent must be used within a ThemeContextProvider')
  }

  const { themeMode } = themeContext

  const toolbarStyle = {
    backgroundColor: themeMode === IThemeMode.DARK ? 'ligthgray' : 'white',
  }
  return (
    <>
      <LexicalComposer
        initialConfig={{
          ...initialConfig,
          editable:
            role === 'CONTENT_REVIEWER'
              ? false
              : status === 'CONTENT_DONE'
                ? false
                : status === 'NOT_PUBLISHED'
                  ? false
                  : true,
        }}
      >
        <TableContext>
          <Box
            sx={{
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              borderRadius: 2,
              border: 1,
              borderColor: 'lightgray',
            }}
          >
            <ToolbarPlugin />
            <Box
              sx={{
                ...toolbarStyle,
                position: 'relative',
                width: '100%',
                margin: 'auto',
                padding: 0.5,
                minHeight: '450px',
              }}
            >
              <RichTextPlugin
                contentEditable={<MuiContentEditable />}
                placeholder={<Box sx={placeHolderSx}>Enter your text here</Box>}
                ErrorBoundary={LexicalErrorBoundary}
              />
              <CommentPlugin />
              <HistoryPlugin />
              <ImagesPlugin captionsEnabled={false} />
              <ExcalidrawPlugin />
              <YouTubePlugin />
              <ListPlugin />
              <LinkPlugin />
              <AutoEmbedPlugin />
              <MyOnChangePlugin onChange={onEditorChange} />
              <ClearEditorPlugin />
              <TablePlugin
                hasCellMerge={tableCellMerge}
                hasCellBackgroundColor={tableCellBackgroundColor}
              />
              <TableCellResizer />
              <EquationsPlugin />
              {showTableOfContents && <TableOfContentsPlugin />}
            </Box>
          </Box>
        </TableContext>
      </LexicalComposer>
    </>
  )
}
export default EditorWrapper
interface MyOnChangePluginProps {
  onChange: (editorStateJSONString: string) => void
}
function MyOnChangePlugin({ onChange }: MyOnChangePluginProps) {
  const [editor] = useLexicalComposerContext()
  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      const editorStateJSON = editorState.toJSON()
      const editorStateJSONString = JSON.stringify(editorStateJSON)
      onChange(editorStateJSONString)
    })
  }, [editor, onChange])
  return null
}
