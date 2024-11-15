/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { mergeRegister } from '@lexical/utils'
import {
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from 'lexical'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import './style.css'
import FormatStrikethroughIcon from '@mui/icons-material/FormatStrikethrough'
import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material'
import { createPortal } from 'react-dom'
import useOnClickListener from '../../Toolbar/useOnClickListener'
import FloatingLinkEditor from '../../Toolbar/FloatingLinkEditor'
import pluginsList from '../../Toolbar/toolbarIconsList'
import { INSERT_EXCALIDRAW_COMMAND } from '../../plugin/ExcalidrawPlugin'
import { EmbedConfigs } from '../../plugin/AutoEmbedPlugin'
import { INSERT_EMBED_COMMAND } from '@lexical/react/LexicalAutoEmbedPlugin'
import { InsertTableDialog } from '../../plugin/TablePlugin'
import useModal from '../../../../hooks/useModal'
import { InsertEquationDialog } from '../../plugin/EquationsPlugin'
import { ThemeContext } from '../../../../../../ThemeContext'
import { IThemeMode } from '../../../../../../ThemeContext/types'
import ReplayIcon from '@mui/icons-material/Replay'
import RefreshIcon from '@mui/icons-material/Refresh'
import ViewHeadlineIcon from '@mui/icons-material/ViewHeadline'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered'
import FormatQuoteIcon from '@mui/icons-material/FormatQuote'
import CodeIcon from '@mui/icons-material/Code'
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft'
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight'
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter'
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify'
import BackupTableIcon from '@mui/icons-material/BackupTable'
import IsoIcon from '@mui/icons-material/Iso'
import YouTubeIcon from '@mui/icons-material/YouTube'
import FormatShapesIcon from '@mui/icons-material/FormatShapes'
import { AuthContext } from '../../../../../../context/AuthContext/AuthContext'
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode'
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule'
import { INSERT_COLLAPSIBLE_COMMAND } from '../../plugin/CollapsiblePlugin'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import SubscriptIcon from '@mui/icons-material/Subscript'
import SuperscriptIcon from '@mui/icons-material/Superscript'
import ImageIcon from '@mui/icons-material/Image'

const LowPriority = 3

function Divider() {
  return <div className="divider" />
}

export default function ToolbarPlugin(subTopicStatus: any) {
  const { state } = useContext(AuthContext)
  const role = state.user?.role

  const [editor] = useLexicalComposerContext()
  const toolbarRef = useRef(null)
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)
  const [, setIsBold] = useState(false)
  const [, setIsItalic] = useState(false)
  const [, setIsUnderline] = useState(false)
  const [, setIsStrikethrough] = useState(false)
  const [, setCodeBlock] = useState(false)
  const [age, setAge] = useState('1')
  const [insert] = useState('1')
  const [align, setAlign] = useState('1')
  const [newModal, showModal] = useModal()
  const [activeEditor, setActiveEditor] = useState(editor)

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
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        $updateToolbar()
        setActiveEditor(newEditor)
        return false
      },
      COMMAND_PRIORITY_CRITICAL,
    )
  }, [editor, $updateToolbar])

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
  const handleAlignText = (event: SelectChangeEvent) => {
    setAlign(event.target.value as string)
  }
  const handleAlignInsert = (event: SelectChangeEvent) => {
    setAlign(event.target.value as string)
  }

  const { onClick, isLink, editor: hookEditor, modal } = useOnClickListener()

  const themeContext = useContext(ThemeContext)

  if (!themeContext) {
    throw new Error('YourComponent must be used within a ThemeContextProvider')
  }

  const { themeMode } = themeContext

  const toolbarStyle = {
    backgroundColor: themeMode === IThemeMode.DARK ? '' : 'white',
  }

  return (
    <>
      <div
        className="toolbar"
        ref={toolbarRef}
        style={{
          ...toolbarStyle,
          border: 1,
          borderStyle: 'solid',
          borderColor: 'lightgray',
          padding: 4,
          display: 'flex',
          alignItems: 'center',
          gap: 3,
        }}
      >
        <IconButton
          style={{ width: 30, borderRadius: 6, marginLeft: 9 }}
          disabled={
            !canUndo ||
            role === 'CONTENT_REVIEWER' ||
            subTopicStatus?.subTopicStatus === 'CONTENT_DONE' ||
            subTopicStatus?.subTopicStatus === 'REVIEW_ASSIGNED' ||
            subTopicStatus?.subTopicStatus === 'READY_TO_PUBLISH' ||
            subTopicStatus?.subTopicStatus === 'CONTENT_DONE' ||
            subTopicStatus?.subTopicStatus === 'REVIEW_ASSIGNED' ||
            subTopicStatus?.subTopicStatus === 'PUBLISHED'
          }
          onClick={() => {
            editor.dispatchCommand(UNDO_COMMAND, undefined)
          }}
          type="button"
        >
          <ReplayIcon className="format undo" />
        </IconButton>
        <IconButton
          style={{ width: 30, borderRadius: 6, padding: 8 }}
          disabled={
            !canRedo ||
            role === 'CONTENT_REVIEWER' ||
            subTopicStatus?.subTopicStatus === 'CONTENT_DONE' ||
            subTopicStatus?.subTopicStatus === 'REVIEW_ASSIGNED' ||
            subTopicStatus?.subTopicStatus === 'READY_TO_PUBLISH' ||
            subTopicStatus?.subTopicStatus === 'CONTENT_DONE' ||
            subTopicStatus?.subTopicStatus === 'REVIEW_ASSIGNED' ||
            subTopicStatus?.subTopicStatus === 'PUBLISHED'
          }
          onClick={() => {
            editor.dispatchCommand(REDO_COMMAND, undefined)
          }}
          type="button"
        >
          <RefreshIcon className="format redo" />
        </IconButton>
        <Divider />
        {/* <FormControl size="small">
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
                <img
                  src={textParagraph}
                  alt="paragraph"
                  className="icon paragraph"
                />
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
                <img src={typeH1} alt="Heading 1" className="icon h1" />
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
                <img src={typeH2} alt="Heading 2" className="icon h2" />
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
                <img src={typeH3} alt="Heading 3" className="icon h3" />
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
                <img
                  src={listUl}
                  alt="Bullet List"
                  className="icon bullet-list"
                />
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
                <img
                  src={numberedList}
                  alt="Numbered list"
                  className="icon numbered-list"
                />
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
                <img src={quote} alt="Quote list" className="icon Quote" />
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
                <img src={code} alt="code" className="icon code" />
                <text>Code Block</text>
              </div>
            </MenuItem>
          </Select>
        </FormControl> */}
        <FormControl
          size="small"
          disabled={
            role === 'CONTENT_REVIEWER' ||
            subTopicStatus?.subTopicStatus === 'CONTENT_DONE' ||
            subTopicStatus?.subTopicStatus === 'REVIEW_ASSIGNED' ||
            subTopicStatus?.subTopicStatus === 'READY_TO_PUBLISH' ||
            subTopicStatus?.subTopicStatus === 'CONTENT_DONE' ||
            subTopicStatus?.subTopicStatus === 'REVIEW_ASSIGNED' ||
            subTopicStatus?.subTopicStatus === 'PUBLISHED'
          }
        >
          <Select
            id="demo-simple-select"
            value={age}
            onChange={handleChange}
            sx={{ minWidth: '145px', borderRadius: '5px', width: 'auto' }}
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
                {/* <img
                  src={textParagraph}
                  alt="paragraph"
                  className="icon paragraph"
                /> */}
                <ViewHeadlineIcon fontSize="small" />
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
                {/* <img src={typeH1} alt="Heading 1" className="icon h1" /> */}
                H1 <text>Heading 1</text>
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
                {/* <img src={typeH2} alt="Heading 2" className="icon h2" /> */}
                H2 <text>Heading 2</text>
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
                {/* <img src={typeH3} alt="Heading 3" className="icon h3" /> */}
                H3 <text>Heading 3</text>
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
                <FormatListBulletedIcon
                  className="icon bullet-list"
                  fontSize="small"
                />
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
                {/* <img src={numberedList} alt="Numbered list" /> */}
                <FormatListNumberedIcon
                  className="icon numbered-list"
                  fontSize="small"
                />
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
                {/* <img src={quote} alt="Quote list" /> */}
                <FormatQuoteIcon className="icon Quote" fontSize="small" />
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
                {/* <img src={code} alt="code" /> */}
                <CodeIcon className="icon code" fontSize="small" />
                <text>Code Block</text>
              </div>
            </MenuItem>
          </Select>
        </FormControl>
        <Divider />
        {pluginsList.map((plugin) => (
          <IconButton
            style={{ width: '60px', borderRadius: 10 }}
            key={plugin.id}
            disabled={
              role === 'CONTENT_REVIEWER' ||
              subTopicStatus?.subTopicStatus === 'CONTENT_DONE' ||
              subTopicStatus?.subTopicStatus === 'REVIEW_ASSIGNED' ||
              subTopicStatus?.subTopicStatus === 'READY_TO_PUBLISH' ||
              subTopicStatus?.subTopicStatus === 'CONTENT_DONE' ||
              subTopicStatus?.subTopicStatus === 'REVIEW_ASSIGNED' ||
              subTopicStatus?.subTopicStatus === 'PUBLISHED'
            }
          >
            <plugin.Icon onClick={() => onClick(plugin.event)} />
          </IconButton>
        ))}

        <IconButton
          style={{ width: '60px', borderRadius: 10 }}
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')
          }}
          disabled={
            role === 'CONTENT_REVIEWER' ||
            subTopicStatus?.subTopicStatus === 'CONTENT_DONE' ||
            subTopicStatus?.subTopicStatus === 'REVIEW_ASSIGNED' ||
            subTopicStatus?.subTopicStatus === 'READY_TO_PUBLISH' ||
            subTopicStatus?.subTopicStatus === 'CONTENT_DONE' ||
            subTopicStatus?.subTopicStatus === 'REVIEW_ASSIGNED' ||
            subTopicStatus?.subTopicStatus === 'PUBLISHED'
          }
        >
          <CodeIcon />
        </IconButton>
        <Divider />
        <FormControl
          sx={{ minWidth: '120px', borderRadius: '5px', width: 'auto' }}
          size="small"
          disabled={
            role === 'CONTENT_REVIEWER' ||
            subTopicStatus?.subTopicStatus === 'CONTENT_DONE' ||
            subTopicStatus?.subTopicStatus === 'REVIEW_ASSIGNED' ||
            subTopicStatus?.subTopicStatus === 'READY_TO_PUBLISH' ||
            subTopicStatus?.subTopicStatus === 'CONTENT_DONE' ||
            subTopicStatus?.subTopicStatus === 'REVIEW_ASSIGNED' ||
            subTopicStatus?.subTopicStatus === 'PUBLISHED'
          }
        >
          <Select
            labelId="demo-simple-select"
            value={align}
            onChange={handleAlignText}
            sx={{ width: 'auto' }}
            inputProps={{ 'aria-label': 'Without label' }}
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
                  gap: 9,
                }}
              >
                {/* <img src={textLeftIcon} alt="Left Align Icon" /> */}
                <FormatAlignLeftIcon fontSize="small" />
                <text className="alignment-text">Left</text>
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
                {/* <img src={textRightIcon} alt="Left Align Icon" /> */}
                <FormatAlignRightIcon fontSize="small" />
                <text className="alignment-text">Right</text>
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
                {/* <img src={textCenterIcon} alt="Left Align Icon" /> */}
                <FormatAlignCenterIcon />
                <text className="alignment-text">Center</text>
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
                {/* <img src={textJustifyIcon} alt="Left Align Icon" /> */}
                <FormatAlignJustifyIcon fontSize="small" />
                <text className="alignment-text">Justify</text>
              </div>
            </MenuItem>
          </Select>
        </FormControl>
        <Divider />

        <FormControl
          sx={{ minWidth: 170, width: '220px' }}
          size="small"
          disabled={
            role === 'CONTENT_REVIEWER' ||
            subTopicStatus?.subTopicStatus === 'CONTENT_DONE' ||
            subTopicStatus?.subTopicStatus === 'REVIEW_ASSIGNED' ||
            subTopicStatus?.subTopicStatus === 'READY_TO_PUBLISH' ||
            subTopicStatus?.subTopicStatus === 'CONTENT_DONE' ||
            subTopicStatus?.subTopicStatus === 'REVIEW_ASSIGNED' ||
            subTopicStatus?.subTopicStatus === 'PUBLISHED'
          }
        >
          <Select
            value={insert}
            onChange={handleAlignInsert}
            displayEmpty
            inputProps={{ 'aria-label': 'Without label' }}
          >
            <MenuItem
              disabled
              value={1}
              sx={{
                display: 'flex',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <text
                className="text"
                style={{
                  fontSize: 17,
                }}
              >
                + Insert
              </text>
            </MenuItem>
            <MenuItem
              onClick={() => {
                editor.dispatchCommand(INSERT_EXCALIDRAW_COMMAND, undefined)
              }}
              className="item"
            >
              {/* <img src={diagram2} alt="Excalidraw" className="icon diagram-2" /> */}
              <FormatShapesIcon className="icon diagram-2" />
              <text className="text">Excalidraw</text>
            </MenuItem>

            <MenuItem
              className="item"
              onClick={() => {
                showModal('Insert Table', (onClose) => (
                  <InsertTableDialog
                    activeEditor={activeEditor}
                    onClose={onClose}
                  />
                ))
              }}
            >
              {/* <img src={table} alt="table" className="icon table" /> */}
              <BackupTableIcon className="icon table" fontSize="small" />
              <text className="text">Table</text>
            </MenuItem>

            <MenuItem
              className="item"
              onClick={() => {
                showModal('Insert Equation', (onClose) => (
                  <InsertEquationDialog
                    activeEditor={activeEditor}
                    onClose={onClose}
                  />
                ))
              }}
            >
              {/* <img
                src={plusSlashMinus}
                alt="equation"
                className="icon equation"
              /> */}
              <IsoIcon className="icon equation" fontSize="large" />
              <text className="text">Equation</text>
            </MenuItem>

            {EmbedConfigs.map((embedConfig) => (
              <MenuItem
                className="item youtube-select"
                key={embedConfig.type}
                onClick={() => {
                  editor.dispatchCommand(INSERT_EMBED_COMMAND, embedConfig.type)
                }}
              >
                {/* <img src={youtube} alt="youtube" className="icon youtube" /> */}
                <YouTubeIcon className="icon youtube" />
                <span className="text">{embedConfig.contentName}</span>
              </MenuItem>
            ))}

            <MenuItem
              onClick={() => {
                activeEditor.dispatchCommand(
                  INSERT_HORIZONTAL_RULE_COMMAND,
                  undefined,
                )
              }}
              className="item"
            >
              {/* <img src={diagram2} alt="Excalidraw" className="icon diagram-2" /> */}
              <div
                style={{
                  gap: '10px',
                  display: 'flex',
                  justifyContent: 'start',
                  alignItems: 'center',
                }}
              >
                <HorizontalRuleIcon />
                <text className="text">Horizontal Rule</text>
              </div>
            </MenuItem>

            <MenuItem
              onClick={() => {
                editor.dispatchCommand(INSERT_COLLAPSIBLE_COMMAND, undefined)
              }}
              className="item"
            >
              {/* <img src={diagram2} alt="Excalidraw" className="icon diagram-2" /> */}
              <div
                style={{
                  gap: '10px',
                  display: 'flex',
                  justifyContent: 'start',
                  alignItems: 'center',
                }}
              >
                <PlayArrowIcon />
                <Typography className="text">Collapsible container</Typography>
              </div>
            </MenuItem>

            <MenuItem onClick={() => onClick('insertImage')} className="item">
              {/* <img src={diagram2} alt="Excalidraw" className="icon diagram-2" /> */}
              <div
                style={{
                  gap: '10px',
                  display: 'flex',
                  justifyContent: 'start',
                  alignItems: 'center',
                }}
              >
                <ImageIcon />
                <Typography className="text">Image</Typography>
              </div>
            </MenuItem>
          </Select>
        </FormControl>

        <FormControl
          sx={{ width: '170px' }}
          size="small"
          disabled={
            role === 'CONTENT_REVIEWER' ||
            subTopicStatus?.subTopicStatus === 'CONTENT_DONE' ||
            subTopicStatus?.subTopicStatus === 'REVIEW_ASSIGNED' ||
            subTopicStatus?.subTopicStatus === 'READY_TO_PUBLISH' ||
            subTopicStatus?.subTopicStatus === 'CONTENT_DONE' ||
            subTopicStatus?.subTopicStatus === 'REVIEW_ASSIGNED' ||
            subTopicStatus?.subTopicStatus === 'PUBLISHED'
          }
          fullWidth
        >
          <InputLabel id="demo-simple-select-label">Formatting</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={age}
            label="Age"
            onChange={handleChange}
          >
            <MenuItem
              value="1"
              onClick={() => {
                activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'superscript')
              }}
              className="item"
            >
              {/* <img src={diagram2} alt="Excalidraw" className="icon diagram-2" /> */}
              <div
                style={{
                  gap: '10px',
                  display: 'flex',
                  justifyContent: 'start',
                  alignItems: 'center',
                }}
              >
                <SubscriptIcon />
                <Typography className="text">Superscript</Typography>
              </div>
            </MenuItem>
            <MenuItem
              value="2"
              onClick={() => {
                activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'subscript')
              }}
              className="item"
            >
              {/* <img src={diagram2} alt="Excalidraw" className="icon diagram-2" /> */}
              <div
                style={{
                  gap: '10px',
                  display: 'flex',
                  justifyContent: 'start',
                  alignItems: 'center',
                }}
              >
                <SubscriptIcon />
                <Typography className="text">Subscript</Typography>
              </div>
            </MenuItem>

            <MenuItem
              value="3"
              onClick={() => {
                activeEditor.dispatchCommand(
                  FORMAT_TEXT_COMMAND,
                  'strikethrough',
                )
              }}
              className="item"
            >
              {/* <img src={diagram2} alt="Excalidraw" className="icon diagram-2" /> */}
              <div
                style={{
                  gap: '10px',
                  display: 'flex',
                  justifyContent: 'start',
                  alignItems: 'center',
                }}
              >
                <FormatStrikethroughIcon />
                <Typography className="text">strikethrough</Typography>
              </div>
            </MenuItem>
          </Select>
        </FormControl>

        {/* <IconButton
          sx={{ borderRadius: 2, padding: 2, fontSize: 20 }}
          onClick={() => {
            editor.dispatchCommand(INSERT_EXCALIDRAW_COMMAND, undefined)
          }}
        >
          <DrawIcon sx={{ mr: 1 }} /> Exclidraw
        </IconButton> */}
        {/* {EmbedConfigs.map((embedConfig) => (
          <IconButton
            sx={{ borderRadius: 2, padding: 2, fontSize: 20 }}
            key={embedConfig.type}
            onClick={() => {
              editor.dispatchCommand(INSERT_EMBED_COMMAND, embedConfig.type)
            }}
            className="item"   // coment this line
          >
            {embedConfig.icon}   // coment this lien
            <Divider />
            <YouTubeIcon sx={{ mr: 1 }} />
            <span className="text">{embedConfig.contentName}</span>
          </IconButton>
        ))} */}
        {/* <IconButton
          sx={{ borderRadius: 2, padding: 2, fontSize: 20 }}
          onClick={() => {
            showModal('Insert Table', (onClose) => (
              <InsertTableDialog
                activeEditor={activeEditor}
                onClose={onClose}
              />
            ))
          }}
        >
          <BackupTableIcon sx={{ mr: 1 }} /> <span className="text">Table</span>
        </IconButton>

        <IconButton
          sx={{ borderRadius: 2, padding: 2, fontSize: 20 }}
          onClick={() => {
            showModal('Insert Equation', (onClose) => (
              <InsertEquationDialog
                activeEditor={activeEditor}
                onClose={onClose}
              />
            ))
          }}
        >
          <ExposureIcon sx={{ mr: 1 }} /> <span className="text">Equation</span>
        </IconButton> */}
        {isLink &&
          createPortal(
            <FloatingLinkEditor editor={hookEditor} />,
            document.body,
          )}
        {modal}
        {newModal}
      </div>
    </>
  )
}
