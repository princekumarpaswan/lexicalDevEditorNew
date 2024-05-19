import { BaseLayout } from '../../components/BaseLayout'
import AdminComponent from '../../components/AdminComponent'
// import ContentWriterComponent from '../../components/ContentWriterComponent'
// import ContentReviewerComponent from '../../components/ContentReviewerComponent'
// import { useContext } from 'react'
// import { AuthContext } from '../../context/AuthContext/AuthContext'

const TutorialsContent: React.FC = () => {
  // const { state } = useContext(AuthContext)
  // const role = state.user?.role

  // let componentToRender: JSX.Element | null = null

  // switch (role) {
  //   case 'ADMIN':
  //     componentToRender = <AdminComponent />
  //     break
  //   case 'CONTENT_WRITER':
  //     componentToRender = <ContentWriterComponent />
  //     break
  //   case 'CONTENT_REVIEWER':
  //     componentToRender = <ContentReviewerComponent />
  //     break
  //   default:
  //     // Handle default case, if needed
  //     break
  // }

  return (
    <div>
      <BaseLayout title={'TutorialContent'}>
      <AdminComponent />
      </BaseLayout>
    </div>
  )
}

export default TutorialsContent
