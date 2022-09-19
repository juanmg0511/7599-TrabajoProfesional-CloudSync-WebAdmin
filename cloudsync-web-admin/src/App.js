import React, { Suspense, useState, useEffect } from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { isAuthed, isAuthing } from './stateapi/auth.js'
import { REACT_APP_ENV } from './config.js'
import './scss/style.scss'

function getFaviconEl() {
  return document.getElementById("app-favicon")
}

const favicon = getFaviconEl()
if (REACT_APP_ENV == 'QA') {
  favicon.href = window.location.origin + '/' + 'favicon-cs-qa.ico'
} else if (REACT_APP_ENV == 'DEV') {
    favicon.href = window.location.origin + '/' + 'favicon-cs-dev.ico'
  }

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const PwdReset = React.lazy(() => import('./views/pages/pwdreset/Pwdreset'))

const PrivateRoute = () => {

  const authed = useSelector(isAuthed)
  const authing = useSelector(isAuthing)

  if (authing) {
    return <Navigate to='/login' />
    } else if (authed) {
      return <DefaultLayout />
      } else {
        return <Navigate to='/login' />
      }
}
    
const App = () => {
  const authed = useSelector(isAuthed)
  const dispatch = useDispatch()
  const [error, changeError] = useState(false)

  useEffect(() => {
    axios.interceptors.response.use(
      response => response,
      error => {
        if (
          error.response !== 500 &&
          error.response.data.message.includes('session')
        ) {
          changeError(true)
          alert('Your session has expired.')
          dispatch({
            type: AUTH_LOGOUT
          })
        }
        return Promise.reject(error)
      }
    )
  }, [dispatch])

  return (
      <BrowserRouter>
        <Suspense fallback={loading}>
          <Routes>
            {/* Private pages and login routing */}
            <Route path='*' name="Home" element={<PrivateRoute />} />
            {/* Public pages */}
            <Route exact path="/pwdreset" name="Password Reset" element={<PwdReset />} />
            <Route exact path="/login" name="User Login" element={<Login />} />
            <Route exact path="/404" name="Not Found" element={<Page404 />} />            
          </Routes>
        </Suspense>
      </BrowserRouter>

      //ToDO: snackbar/notificación de sesion expirada!

  )
}

export default App
