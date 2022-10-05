import React, { useState, useRef, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import {
  CSpinner,
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CToaster,
  CToast,
  CToastBody,
  CToastClose,  
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked,
         cilUser,
         cilWarning } from '@coreui/icons'
import { sygnetCsDev } from 'src/assets/brand/sygnet-cs-dev'
import { sygnetCsQa } from 'src/assets/brand/sygnet-cs-qa'
import { sygnetCsProd } from 'src/assets/brand/sygnet-cs-prod'
import { APP_ENV, APP_DEV_COLOR, APP_QA_COLOR } from '../../../config.js'
/* Import WebApi */
import { doAuth } from '../../../webapi'
/* Import Constants */
import {
  AUTH_REQUEST,
  AUTH_SUCCESS
} from '../../../config.js'

const Login = () => {

  const [username, changeUsername] = useState('')
  const [password, changePassword] = useState('')
  const [authed, changeAuthed] = useState(false)
  const [authing, changeAuthing] = useState(false)
  const [authError, changeAuthError] = useState(false)

  const dispatch = useDispatch()

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

  function onSubmit (e) {
    e.preventDefault()

    if (!username || !password) {

      addToast(generateToast("warning","Please verify your input!"))
    }
    else {

      dispatch({ type: AUTH_REQUEST })
      changeAuthing(true)
      doAuth({ username: username, password: password })
        .then(response => {
          const { data } = response
          dispatch({
            type: AUTH_SUCCESS,
            payload: {
              token: data.session_token,
              username: data.username
            }
          })
          changeAuthing(false)
          changeAuthed(true)
          console.log("Authentication succesful. Logged in as: \"" + data.username + "\".")
        })
        .catch(_ => {

          changeAuthing(false)
          changeAuthError(true)
          console.log("Authentication failure.")
        })
    }
  }

  useEffect(() => {
    document.title = 'FIUBA CloudSync - Admin Site (Login)';
  });

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      { authed ? (
        <Navigate to="/"/>) : null }
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="p-4">
              <CCardBody>
                <CForm>
                  <div>
                    {(APP_ENV == 'PROD' ? (<CIcon className="sidebar-brand-narrow" icon={sygnetCsProd} height={50} />) : (APP_ENV == 'QA' ? (<CIcon className="sidebar-brand-narrow" icon={sygnetCsQa} height={50} />) : (<CIcon className="sidebar-brand-narrow" icon={sygnetCsDev} height={50} />)))}
                    <span style={{fontSize: '1.75rem',
                                  fontWeight: '500',
                                  lineHeight: '50px',
                                  position: 'absolute',
                                  marginLeft: '15px'}}>
                      FIUBA CloudSync
                    </span>
                    <p style={{
                          marginLeft: '65px',
                          marginTop: '-5px'}}>
                      {(APP_ENV == 'PROD' ? (null) : (APP_ENV == 'QA' ? (<span style={{color: APP_QA_COLOR, fontWeight: '500'}}>[QA]</span>) : (<span style={{color: APP_DEV_COLOR, fontWeight: '500'}}>[DEV]</span>)))} Admin site
                    </p>
                  </div>
                  <p className="text-medium-emphasis">Sign In to your account</p>
                  { authError ? (
                    <CAlert color="danger">
                      <CIcon icon={cilWarning} className="flex-shrink-0 me-2" width={24} height={24} />
                        <span>Invalid login credentials!</span>
                      </CAlert> ) : null
                  }
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      name='username'
                      placeholder="Username"
                      autoComplete="username"
                      onChange={e => changeUsername(e.target.value)}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      name='password'
                      type="password"
                      placeholder="Password"
                      autoComplete="current-password"
                      onChange={e => changePassword(e.target.value)}
                    />
                  </CInputGroup>
                  <CRow>
                    <CCol xs={6}>
                    {authing ? (
                      <CButton disabled>
                        <CSpinner component="span" size="sm" aria-hidden="true"/>
                      </CButton>
                      ) : (
                      <CButton type="submit" color="primary" className="px-4" onClick={onSubmit}>
                        Login
                      </CButton>)
                    }
                    </CCol>
                    <CCol xs={6} className="text-right">
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
      <div className="d-none d-sm-block"
        style={{
          position: 'fixed',
          left: '50%',
          bottom: '20px',
          transform: 'translate(-50%, -50%)',
          margin: '0 auto'
      }}>
        FIUBA - 75.99 - 1C2022
      </div>
      <CToaster ref={toaster} push={toast} placement="top-end" />
    </div>
  )
}

export default Login
