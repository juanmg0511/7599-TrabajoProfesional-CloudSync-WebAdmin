import React, { Suspense, useState, useRef, useEffect } from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import {
  CToaster,
  CToast,
  CToastBody,
  CToastClose,
} from '@coreui/react'
import { isAuthed, isAuthing } from './stateapi/auth.js'
import { APP_ENV } from './config.js'
import './scss/style.scss'

function getFaviconEl() {
  return document.getElementById("app-favicon")
}

const favicon = getFaviconEl()
if (APP_ENV == 'QA') {
  favicon.href = window.location.origin + '/' + 'favicon-cs-qa.ico'
} else if (APP_ENV == 'DEV') {
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

  function generateToast(toastColor, toastMessage) {
    return (
      <CToast color={toastColor}
              className="text-white align-items-center"
      >
        <div className="d-flex">
          <CToastBody>{toastMessage}</CToastBody>
          <CToastClose className="me-2 m-auto" white />
        </div>
      </CToast>
    )
  }
  const toaster = useRef()
  const [toast, addToast] = useState(0)

  const dispatch = useDispatch()
  useEffect(() => {
    axios.interceptors.response.use(
      response => response,
      error => {
        if (
          error.response !== 500 &&
          error.response.data.message.includes('session')
        ) {
          addToast(generateToast("danger","Your session has expired!"))
          dispatch({
            type: AUTH_LOGOUT
          })
        }
        return Promise.reject(error)
      }
    )
  }, [dispatch])

  //Main App
  return (
    <>
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
      <CToaster ref={toaster} push={toast} placement="top-end" />
    </>
  )
}

export default App
