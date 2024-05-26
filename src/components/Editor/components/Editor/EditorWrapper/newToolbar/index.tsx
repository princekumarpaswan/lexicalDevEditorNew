import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { mergeRegister } from '@lexical/utils'
import {
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from 'lexical'
import { useCallback, useEffect, useRef, useState } from 'react'
import './style.css'
import UndoIcon from '@mui/icons-material/Undo'
import RedoIcon from '@mui/icons-material/Redo'
import NotesIcon from '@mui/icons-material/Notes'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered'
import FormatQuoteIcon from '@mui/icons-material/FormatQuote'
import FormatBoldIcon from '@mui/icons-material/FormatBold'
import FormatItalicIcon from '@mui/icons-material/FormatItalic'
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined'
import FormatStrikethroughIcon from '@mui/icons-material/FormatStrikethrough'
import CodeIcon from '@mui/icons-material/Code'
import AddLinkIcon from '@mui/icons-material/AddLink'
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material'

import { createPortal } from 'react-dom'
import useOnClickListener from '../../Toolbar/useOnClickListener'
import FloatingLinkEditor from '../../Toolbar/FloatingLinkEditor'

const LowPriority = 1

function Divider() {
  return <div className="divider" />
}

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext()
  const toolbarRef = useRef(null)
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [isStrikethrough, setIsStrikethrough] = useState(false)
  const [codeBlock, setCodeBlock] = useState(false)
  const [age, setAge] = useState('Normal')

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'))
      setIsItalic(selection.hasFormat('italic'))
      setIsUnderline(selection.hasFormat('underline'))
      setIsStrikethrough(selection.hasFormat('strikethrough'))
      setCodeBlock(selection.hasFormat('code'))
    }
  }, [])

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar()
        })
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (_payload, _newEditor) => {
          $updateToolbar()
          return false
        },
        LowPriority,
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload)
          return false
        },
        LowPriority,
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload)
          return false
        },
        LowPriority,
      ),
    )
  }, [editor, $updateToolbar])

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string)
  }

  const { onClick, isLink, editor: hookEditor, modal } = useOnClickListener()

  return (
    <div className="toolbar" ref={toolbarRef}>
      <button
        disabled={!canUndo}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, undefined)
        }}
        className="toolbar-item spaced"
        aria-label="Undo"
      >
        <i className="format undo">
          <UndoIcon />
        </i>
      </button>
      <button
        disabled={!canRedo}
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND, undefined)
        }}
        className="toolbar-item"
        aria-label="Redo"
      >
        <i className="format redo">
          <RedoIcon />
        </i>
      </button>
      <Divider />
      <FormControl
        sx={{ minWidth: '100px', borderRadius: '5px', width: 'auto' }}
      >
        <InputLabel id="demo-simple-select-label">Type</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={age}
          label="Type"
          onChange={handleChange}
          defaultValue="1"
        >
          <MenuItem value={'1'} onClick={() => onClick('paragraph')}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <NotesIcon />
              <text>Normal</text>
            </div>
          </MenuItem>
          <MenuItem value={'2'} onClick={() => onClick('h1')}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <div style={{ fontWeight: 700 }}>H1</div>
              <text>Heading 1</text>
            </div>
          </MenuItem>
          <MenuItem value={'3'} onClick={() => onClick('h2')}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <div style={{ fontWeight: 700 }}>H2</div>
              <text>Heading 2</text>
            </div>
          </MenuItem>
          <MenuItem value={'4'} onClick={() => onClick('h3')}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <div style={{ fontWeight: 700 }}>H3</div>
              <text>Heading 3</text>
            </div>
          </MenuItem>
          <MenuItem value={'5'} onClick={() => onClick('ul')}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <FormatListBulletedIcon />
              <text>Bullet List</text>
            </div>
          </MenuItem>
          <MenuItem value={'6'} onClick={() => onClick('ol')}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <FormatListNumberedIcon />
              <text>Number List</text>
            </div>
          </MenuItem>
          <MenuItem value={'7'} onClick={() => onClick('quote')}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <FormatQuoteIcon />
              <text>Quote List</text>
            </div>
          </MenuItem>
          <MenuItem value={'8'} onClick={() => onClick('formatCode')}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <CodeIcon />
              <text>Code Block</text>
            </div>
          </MenuItem>
        </Select>
      </FormControl>
      <Divider />
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')
        }}
        className={'toolbar-item spaced ' + (isBold ? 'active' : '')}
        aria-label="Format Bold"
      >
        <FormatBoldIcon />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')
        }}
        className={'toolbar-item spaced ' + (isItalic ? 'active' : '')}
        aria-label="Format Italics"
      >
        <FormatItalicIcon />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')
        }}
        className={'toolbar-item spaced ' + (isUnderline ? 'active' : '')}
        aria-label="Format Underline"
      >
        <FormatUnderlinedIcon />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')
        }}
        className={'toolbar-item spaced ' + (isStrikethrough ? 'active' : '')}
        aria-label="Format Strikethrough"
      >
        <FormatStrikethroughIcon />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')
        }}
        className={'toolbar-item spaced ' + (codeBlock ? 'active' : '')}
        aria-label="Format Code Block"
      >
        <CodeIcon />
      </button>
      <button
        onClick={() => onClick('formatInsertLink')}
        className="toolbar-item spaced"
        aria-label="Add Link"
      >
        <AddLinkIcon />
      </button>
      <Divider />
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')
        }}
        className="toolbar-item spaced"
        aria-label="Left Align"
      >
        <i className="format left-align" />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')
        }}
        className="toolbar-item spaced"
        aria-label="Center Align"
      >
        <i className="format center-align" />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')
        }}
        className="toolbar-item spaced"
        aria-label="Right Align"
      >
        <i className="format right-align" />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')
        }}
        className="toolbar-item"
        aria-label="Justify Align"
      >
        <i className="format justify-align" />
      </button>
      {isLink &&
        createPortal(<FloatingLinkEditor editor={hookEditor} />, document.body)}
      {modal}
    </div>
  )
}