import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
// import PrivateRoute from './components/PrivateRoute'
// import PublicRoute from './components/PublicRoute'
// import { AuthProvider } from './context/AuthContext'
// import { LocalStorage } from './helpers/classes'
import { routes } from './routes'

// import './index.css'
// import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/tutorials" />} />
        {routes.map((route) => {
          return (
            <Route key={route.path} path={route.path} element={route.page} />
          )
        })}
      </Routes>
    </BrowserRouter>
  )
}

export default App
