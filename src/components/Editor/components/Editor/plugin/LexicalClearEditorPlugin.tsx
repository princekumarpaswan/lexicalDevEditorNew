import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
  $createParagraphNode,
  $getRoot,
  $getSelection,
  $isRangeSelection,
  CLEAR_EDITOR_COMMAND,
  COMMAND_PRIORITY_EDITOR,
} from 'lexical'
import useLayoutEffect from './useLayoutEffect'

type Props = Readonly<{
  onClear?: () => void
}>

export function ClearEditorPlugin({ onClear }: Props): JSX.Element | null {
  const [editor] = useLexicalComposerContext()

  useLayoutEffect(() => {
    return editor.registerCommand(
      CLEAR_EDITOR_COMMAND,
      () => {
        editor.update(() => {
          if (onClear == null) {
            const root = $getRoot()
            const selection = $getSelection()
            const paragraph = $createParagraphNode()
            root.clear()
            root.append(paragraph)

            if (selection !== null) {
              paragraph.select()
            }
            if ($isRangeSelection(selection)) {
              selection.format = 0
            }
          } else {
            onClear()
          }
        })
        return true
      },
      COMMAND_PRIORITY_EDITOR
    )
  }, [editor, onClear])

  return null
}
