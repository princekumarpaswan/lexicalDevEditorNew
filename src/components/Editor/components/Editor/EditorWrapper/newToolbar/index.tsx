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
import FormatStrikethroughIcon from '@mui/icons-material/FormatStrikethrough'
import CodeIcon from '@mui/icons-material/Code'
import WrapTextIcon from '@mui/icons-material/WrapText'
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft'
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight'
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter'
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
import pluginsList from '../../Toolbar/toolbarIconsList'
import { INSERT_EXCALIDRAW_COMMAND } from '../../plugin/ExcalidrawPlugin'

const LowPriority = 3

function Divider() {
  return <div style={{ margin: '10px' }} className="divider" />
}

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext()
  const toolbarRef = useRef(null)
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)
  const [, setIsBold] = useState(false)
  const [, setIsItalic] = useState(false)
  const [, setIsUnderline] = useState(false)
  const [, setIsStrikethrough] = useState(false)
  const [, setCodeBlock] = useState(false)
  const [age, setAge] = useState('Normal')
  const [align, setAlign] = useState('')

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

  const handleAlign = (event: SelectChangeEvent) => {
    setAlign(event.target.value as string)
  }

  const { onClick, isLink, editor: hookEditor, modal } = useOnClickListener()

  return (
    <>
      <div className="toolbar" ref={toolbarRef}>
        <button
          style={{ width: '60px' }}
          disabled={!canUndo}
          onClick={() => {
            editor.dispatchCommand(UNDO_COMMAND, undefined)
          }}
        >
          <UndoIcon />
        </button>
        <button
          style={{ width: '60px', marginLeft: '7px' }}
          disabled={!canRedo}
          onClick={() => {
            editor.dispatchCommand(REDO_COMMAND, undefined)
          }}
        >
          <RedoIcon />
        </button>
        <Divider />
        <FormControl
          sx={{ minWidth: '140px', borderRadius: '5px', width: 'auto' }}
        >
          <InputLabel id="demo-simple-select-labe">Type</InputLabel>
          <Select
            labelId="demo-simple-select-labe"
            id="demo-simple-select"
            value={age}
            label="Age"
            onChange={handleChange}
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
        {pluginsList.map((plugin) => (
          <button style={{ width: '60px', marginLeft: '7px' }} key={plugin.id}>
            <plugin.Icon onClick={() => onClick(plugin.event)} />
          </button>
        ))}
        <button
          style={{ width: '60px', marginLeft: '7px' }}
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')
          }}
        >
          <FormatStrikethroughIcon />
        </button>
        <button
          style={{ width: '60px', marginLeft: '7px' }}
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')
          }}
        >
          <CodeIcon />
        </button>
        <Divider />
        <FormControl
          sx={{ minWidth: '140px', borderRadius: '5px', width: 'auto' }}
        >
          <InputLabel id="demo-simple-select-label">Alignment</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={align}
            label="Age"
            onChange={handleAlign}
          >
            <MenuItem
              value={1}
              onClick={() => {
                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <FormatAlignLeftIcon />
                <text>Left</text>
              </div>
            </MenuItem>
            <MenuItem
              value={2}
              onClick={() => {
                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <FormatAlignRightIcon />
                <text>Right</text>
              </div>
            </MenuItem>

            <MenuItem
              value={3}
              onClick={() => {
                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <FormatAlignCenterIcon />
                <text>Center</text>
              </div>
            </MenuItem>

            <MenuItem
              value={4}
              onClick={() => {
                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <WrapTextIcon />
                <text>Justify</text>
              </div>
            </MenuItem>
          </Select>
        </FormControl>
        <Divider />
        <button
          onClick={() => {
            editor.dispatchCommand(INSERT_EXCALIDRAW_COMMAND, undefined)
          }}
        >
          Exclidraw
        </button>
      </div>
      {isLink &&
        createPortal(<FloatingLinkEditor editor={hookEditor} />, document.body)}
      {modal}
    </>
  )
}
