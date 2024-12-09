import React, { useContext } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { routes } from './routes'
import { AuthContext, AuthProvider } from './context/AuthContext/AuthContext'
import Login from './pages/Login'
import { ContentProvider } from '../src/context/contentText';


const PrivateRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { state } = useContext(AuthContext)

  return state.accessToken ? children : <Navigate to="/login" />
}


const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ContentProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <Routes>
                  <Route path="/" element={<Navigate to="/tutorials" />} />
                  {routes.map((route) => {
                    return (
                      <Route
                        key={route.path}
                        path={route.path}
                        element={route.page}
                      />
                    )
                  })}
                </Routes>
              </PrivateRoute>
            }
          />
        </Routes>
        </ContentProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
