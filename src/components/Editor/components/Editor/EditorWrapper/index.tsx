// EditorWrapper.tsx
// import { $getRoot } from 'lexical'
import { useState } from 'react'
import { useEffect } from 'react'

import './styles.css'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
// import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
// import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'
import { MuiContentEditable, placeHolderSx } from './styles'
import { Box } from '@mui/material'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin'
// import Toolbar from '../Toolbar'
// import lexicalEditorTheme from '../../../theme/lexicalEditorTheme'
import lexicalEditorConfig from '../config'
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

// import Toolbar from '../Toolbar'
// import NewToolbar from '../NewToolbar'
type EditorWrapperProps = {
  onEditorChange: (editorStateJSONString: string) => void
  initialContent?: string // Accept initial JSON content as prop
}

function EditorWrapper({ onEditorChange, initialContent }: EditorWrapperProps) {
  const [editorState, setEditorState] = useState(initialContent)

  useEffect(() => {
    if (initialContent) {
      setEditorState(JSON.parse(initialContent))
    }
  }, [initialContent])

  const {
    settings: {
      isCollab,
      isRichText,
      showTableOfContents,
      tableCellMerge,
      tableCellBackgroundColor,
    },
  } = useSettings()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const text = isCollab
    ? 'Enter some collaborative rich text...'
    : isRichText
      ? 'Enter some rich text...'
      : 'Enter some plain text...'
  return (
    <>
      <LexicalComposer
        initialConfig={{ ...lexicalEditorConfig, editorState: editorState }}
      >
        <TableContext>
          <>
            <ToolbarPlugin />
            {/* <Toolbar/> */}
            <Box
              sx={{
                position: 'relative',
                background: 'white',
                color: 'black',
                width: '100%',
                margin: 'auto',
                border: 1,
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
              <EquationsPlugin/>
              <div>{showTableOfContents && <TableOfContentsPlugin />}</div>
            </Box>
          </>
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
