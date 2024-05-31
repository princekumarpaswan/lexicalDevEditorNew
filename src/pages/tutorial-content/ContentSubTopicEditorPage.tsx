import { Box, Button, Typography } from '@mui/material'
import { BaseLayout } from '../../components/BaseLayout'
import EditorWrapper from '../../components/Editor/components/Editor/EditorWrapper'
import { useParams } from 'react-router-dom'
import { useState } from 'react'

const ContentSubTopicEditorPage = () => {
  const url = useParams()

  const [editorData, setEditorData] = useState('{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"dsdasdasdasdasdasdas","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"d","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"as","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"d","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"as","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"d","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"asdas","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"mark","version":1,"ids":["zrdwc"]}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"d","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0},{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"asd","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"as","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"dasda","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}')

  // console.log(editorData)



  return (
    <BaseLayout title="Content Editor">
      <Box>
        <Box>
          <Typography
            sx={{
              display: 'flex',
              justifyContent: 'start',
              fontWeight: 700,
              marginBottom: '20px',
            }}
          >
            {url && url.suntopicname?.toUpperCase()}
          </Typography>
        </Box>
        <Box>
          <EditorWrapper
            // eslint-disable-next-line no-console
            onEditorChange={(e) => setEditorData(e)}
            initialContent={editorData}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 5, justifyContent: 'center' }}>
          <Button variant="contained">Submit</Button>
          <Button variant="contained">Content Done</Button>
        </Box>
      </Box>
    </BaseLayout>
  )
}

export default ContentSubTopicEditorPage
