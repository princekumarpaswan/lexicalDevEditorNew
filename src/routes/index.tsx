import { Route } from '../interfaces/route'
import AdminUsers from '../pages/AdminUsers'

import Categories from '../pages/Categories'
import Tutorials from '../pages/Tutorials'
import TutorialsContent from '../pages/TutorialsContent'

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
]
