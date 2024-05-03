import { Route } from '../interfaces/route'
import AdminUsers from '../pages/adminUsers/AdminUsers'

import Categories from '../pages/categories/Categories'
import Tutorials from '../pages/tutorials/Tutorials'
import AddTutorials from '../pages/tutorials/AddTutorials'
import EditTutorials from '../pages/tutorials/EditTutorials'
import TutorialsContent from '../pages/tutorial-content/TutorialsContent'
import AddTutorialContent from '../pages/tutorial-content/AddTutorialContent'

export const routes: Route[] = [
  {
    path: '/tutorials',
    page: <Tutorials />,
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
    path: '/admin-users',
    page: <AdminUsers />,
  },
  {
    path: '/add-tutorial',
    page: <AddTutorials />,
  },
  {
    path: '/edit-tutorial',
    page: <EditTutorials />,
  },
  {
    path: '/add-tutorial-content',
    page: <AddTutorialContent />,
  },
]
