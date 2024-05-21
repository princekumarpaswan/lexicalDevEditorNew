import { Route } from '../interfaces/route'
import AdminUsers from '../pages/adminUsers/AdminUsers'

import Categories from '../pages/categories/Categories'
import Tutorials from '../pages/tutorials/Tutorials'
import AddTutorials from '../pages/tutorials/AddTutorials'
import EditTutorials from '../pages/tutorials/EditTutorials'
import TutorialsContent from '../pages/tutorial-content/TutorialsContent'
import AddTopicAndSubTopic from '../pages/tutorials/AddTopicAndSubTopic'
import AssignTutorialContent from '../pages/tutorial-content/AssignTutorialContent'
import Login from '../pages/Login'
import ContentSubTopicEditorPage from '../pages/tutorial-content/ContentSubTopicEditorPage'

export const routes: Route[] = [
  {
    path: '/login',
    page: <Login />,
  },
  {
    path: '/tutorials',
    page: <Tutorials />,
  },
  {
    path: 'tutorials/add-tutorial',
    page: <AddTutorials />,
  },
  {
    path: '/tutorials/add-tutorial/topic-and-subtopic',
    page: <AddTopicAndSubTopic />,
  },
  {
    path: '/edit-tutorial/:tutorialId',
    page: <EditTutorials />,
  },
  {
    path: '/categories',
    page: <Categories />,
  },
  {
    path: '/tutorial-content',
    page: <TutorialsContent />,
  },
  {
    path: '/tutorial-content/assign-tutorial-content',
    page: <AssignTutorialContent />,
  },
  {
    path: '/tutorial-content/subtopic-write-content',
    page: <ContentSubTopicEditorPage />,
  },
  {
    path: '/admin-users',
    page: <AdminUsers />,
  },
]
