// EditorWrapper.tsx
import { $getRoot } from 'lexical'
import { useState } from 'react'
import { useEffect } from 'react'

import './styles.css'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'
import { MuiContentEditable, placeHolderSx } from './styles'
import { Box } from '@mui/material'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin'
import Toolbar from '../Toolbar'
import lexicalEditorTheme from '../../../theme/lexicalEditorTheme'
import lexicalEditorConfig from '../config'
import ImagesPlugin from '../plugin/ImagePlugin'
import { useTheme } from '@mui/material/styles'
import { ClearEditorPlugin } from '../plugin/LexicalClearEditorPlugin'
type EditorWrapperProps = {
  onEditorChange: (editorStateJSONString: string) => void
  initialContent?: string // Accept initial JSON content as prop
}

function EditorWrapper({ onEditorChange, initialContent }: EditorWrapperProps) {
  const theme = useTheme()
  const [editorState, setEditorState] = useState(initialContent)

  useEffect(() => {
    if (initialContent) {
      setEditorState(JSON.parse(initialContent))
    }
  }, [initialContent])

  return (
    <LexicalComposer
      initialConfig={{ ...lexicalEditorConfig, editorState: editorState }}
    >
      <Toolbar />
      <Box
        sx={{
          position: 'relative',
          background: theme.palette.primary.light,
          color: theme.palette.primary.dark,
        }}
      >
        <RichTextPlugin
          contentEditable={<MuiContentEditable />}
          placeholder={<Box sx={placeHolderSx}>Enter your text here</Box>}
          ErrorBoundary={LexicalErrorBoundary}
        />

        <HistoryPlugin />
        <HistoryPlugin />
        <ImagesPlugin captionsEnabled={false} />
        <ListPlugin />
        <LinkPlugin />
        <MyOnChangePlugin onChange={onEditorChange} />

        <ClearEditorPlugin />
      </Box>
    </LexicalComposer>
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

// EditorWrapper.tsx
// import { $getRoot } from 'lexical'
// import { useState } from 'react'
// import './styles.css'
// import { LexicalComposer } from '@lexical/react/LexicalComposer'
// import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
// import { ContentEditable } from '@lexical/react/LexicalContentEditable'
// import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
// import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
// import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
// import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'
// import { MuiContentEditable, placeHolderSx } from './styles'
// import { Box } from '@mui/material'
// import { ListPlugin } from '@lexical/react/LexicalListPlugin'
// import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin'
// import Toolbar from '../Toolbar'
// import lexicalEditorTheme from '../../../theme/lexicalEditorTheme'
// import lexicalEditorConfig from '../config'
// import ImagesPlugin from '../plugin/ImagePlugin'
// import { useTheme } from '@mui/material/styles'

// function EditorWrapper({
//   onContentChange,
// }: {
//   onContentChange: (content: string) => void
// }) {
//   const [editorContent, setEditorContent] = useState<string>('')
//   const theme = useTheme()
//   const onChange = (editorState: any) => {
//     editorState.read(() => {
//       const root = $getRoot()
//       const content = root.getTextContent()
//       setEditorContent(content)
//       onContentChange(content)
//     })
//   }

//   return (
//     <LexicalComposer initialConfig={lexicalEditorConfig}>
//       <Toolbar />
//       <Box
//         sx={{
//           position: 'relative',
//           background: theme.palette.primary.light,
//           color: theme.palette.primary.dark,
//         }}
//       >
//         <RichTextPlugin
//           contentEditable={<MuiContentEditable />}
//           placeholder={<Box sx={placeHolderSx}>Enter your text here</Box>}
//           ErrorBoundary={LexicalErrorBoundary}
//         />
//         <OnChangePlugin onChange={onChange} />
//         <HistoryPlugin />
//         <HistoryPlugin />
//         <ImagesPlugin captionsEnabled={false} />
//         <ListPlugin />
//         <LinkPlugin />
//       </Box>
//     </LexicalComposer>
//   )
// }

// export default EditorWrapper
